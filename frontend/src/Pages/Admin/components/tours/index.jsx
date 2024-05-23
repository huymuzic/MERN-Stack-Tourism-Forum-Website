import { useCallback, useEffect, useRef, useState } from "react";
import BasePaginationList from "../../../../components/BasePaginationList";
import WrapperFilter from "../WrapperFilter";
import { pushError, pushSuccess } from "../../../../components/Toast";
import { headers } from "../../helper";
import TourItem, { TourRating } from "./TourItem";
import NoData from "../NoData";
import debounce from "../../../../helper";
import { useCustomAutocomplete } from "../../../../components/CustomAutocomplete/useCustomAutocomplete";
import CustomAutocomplete from "../../../../components/CustomAutocomplete/CustomAutocomplete";
import { baseUrl } from "../../../../config";
import PopUpAddTour from "./TourAdd"; 
const forumPostSearchType = [
  {
    id: 1,
    name: "TourName",
    value: "Tour",
  },
  {
    id: 2,
    name: "Country",
    value: "country",
  },
  {
    id: 3,
    name: "City",
    value: "city",
  },
];

export default function ToursList() {
  const pageSize = 8;
  const [filter, setFilter] = useState({
    page: 1,
    searchValue: "",
    searchType: forumPostSearchType[0].value,  // Initialize searchType
    status: undefined,
  });
  const [paging, setPaging] = useState({
    data: [],
    totalCount: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [isAddOpen, setAddOpen] = useState(false); // State to manage add tour popup
  const searchRef = useRef(null);
  const searchTypeRef = useRef(null);

  const handleResetFilter = () => {
    setFilter({ searchValue: "", searchType: forumPostSearchType[0].value, page: 1, status: undefined });
    if (searchRef.current) {
      searchRef.current.value = "";
    }
  };

  const statusAutocomplete = useCustomAutocomplete({
    list: {
      options: TourRating,
      searchFields: ["Name"],
    },
  });

  const handleOnChangeSearch = useCallback(
    debounce((value) => {
      setFilter((prev) => ({ ...prev, searchValue: value, page: 1 }));
    }, 300),
    []
  );

  const fetchTours = async () => {
    setLoading(true);
    const url = new URL(`${baseUrl}/api/v1/tours`);
    url.searchParams.append("page", filter.page);
    url.searchParams.append("limit", pageSize);
    if (filter.status) {
      url.searchParams.append("status", filter.status.Value[0]);  // Use filter.status.Value for rating range
    }
    url.searchParams.append("search", filter.searchValue);
    url.searchParams.append("searchType", filter.searchType);

    console.log(url.toString());  // Log the URL to check query parameters

    try {
      const response = await fetch(url, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        pushError("Failed to get list user");
        return;
      }

      const data = await response.json();
      setPaging(data);
    } catch (error) {
      console.error("fetchTours error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnChangeStatus = (status) => {
    setFilter((prev) => ({ ...prev, status, page: 1 }));
    fetchTours();
  };

  const handleUpdateTour = async (partialTourUpdate) => {
    console.log("🚀 ~ handleUpdateTour ~ partialTourUpdate:", partialTourUpdate)
    try {
      const url = new URL(`${baseUrl}/api/v1/tours/${partialTourUpdate.tour.id}`);
      const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: partialTourUpdate.tour?.title,
          country: partialTourUpdate.tour?.country,
          city: partialTourUpdate.tour?.city,
          price: partialTourUpdate.tour?.price,
          ageRange: partialTourUpdate.tour?.ageRange,
          duration: partialTourUpdate.tour?.duration,
        }),
      });

      if (response.ok) {
        fetchTours();  // Function to fetch the updated list of tours
        pushSuccess("Edit tour successfully");
      } else {
        pushError("Failed to edit tour");
        throw new Error("Failed to edit tour");
      }
    } catch (error) {
      pushError("Failed to edit tour");
    }
  };

  const handleAddTour = async (newTour) => {
    setAddOpen(false);
       try {
      const url = new URL(`${baseUrl}/api/v1/tours/create`);
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTour.tour),
      });

      if (response.ok) {
        fetchTours();  // Function to fetch the updated list of tours
        pushSuccess("Added new tour successfully");
      } else {
        pushError("Failed to add new tour");
        throw new Error("Failed to add new tour");
      }
    } catch (error) {
      pushError("Failed to add new tour");
    }
  };

  useEffect(() => {
    fetchTours();
  }, [filter.page, filter.searchValue, filter.status, filter.searchType]);  // Added searchType dependency

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "32px" }}>
      <WrapperFilter
        onReset={handleResetFilter}
        customAction={
          <div className="input-group ps-4">
            <select
              className="form-select"
              style={{ maxWidth: "140px", width: "25%", cursor: "pointer" }}
              ref={searchTypeRef}
              onChange={(e) => {
                setFilter((prev) => ({ ...prev, searchType: e.target.value }));
              }}
            >
              {forumPostSearchType.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="form-control"
              placeholder="Search"
              aria-label="Search"
              ref={searchRef}
              onChange={(e) => {
                handleOnChangeSearch(e.target.value);
              }}
            />
          </div>
        }
      >
        <div className="d-flex flex-row justify-content-between align-items-center pt-3 pb-3">
          <div className="pe-4" style={{ width: "50%" }}>
            <CustomAutocomplete
              {...statusAutocomplete}
              getOptionLabel={(o) => o.Name}
              label={"Statuses"}
              value={filter.status}
              placeholder={"All statuses"}
              onChange={(s) => {
                handleOnChangeStatus(s);
              }}
            />
          </div>
          <button className="btn btn-primary" onClick={() => setAddOpen(true)}>
            Add New Tour
          </button>
        </div>
      </WrapperFilter>

      <BasePaginationList
        titleTotal="Total tours"
        totalItems={paging.totalCount}
        list={paging.data}
        loading={loading}
        renderItem={(tour) => <TourItem key={tour._id} tour={tour} statusFilter={filter.status} handleUpdateTour={handleUpdateTour} />}  // Pass statusFilter to TourItem
        totalPages={paging.totalPages}
        page={filter.page}
        onChangePage={(page) => setFilter((prev) => ({ ...prev, page }))}
        renderEmpty={() => <NoData>No Data</NoData>}
      />
      <PopUpAddTour
        open={isAddOpen}
        onClose={() => setAddOpen(false)}
        onConfirm={handleAddTour}
        isLoading={loading}
      />
    </div>
  );
}
