import { useCallback, useEffect, useRef, useState } from "react";
import BasePaginationList from "../../../../components/BasePaginationList";
import WrapperFilter from "../WrapperFilter";
import { pushError, pushSuccess } from "../../../../components/Toast";
import TourItem, { TourStatuses } from "./TourItem";
import NoData from "../NoData";
import debounce from "../../../../helper";
import { useCustomAutocomplete } from "../../../../components/CustomAutocomplete/useCustomAutocomplete";
import CustomAutocomplete from "../../../../components/CustomAutocomplete/CustomAutocomplete";
import { baseUrl } from "../../../../config";
import PopUpAddTour from "./TourAdd";

const tourSearchType = [
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
    searchType: tourSearchType[0].value,
    status: undefined,
  });
  const [paging, setPaging] = useState({
    data: [],
    totalCount: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [isAddOpen, setAddOpen] = useState(false);
  const searchRef = useRef(null);
  const searchTypeRef = useRef(null);

  const handleResetFilter = () => {
    setFilter({
      searchValue: "",
      searchType: tourSearchType[0].value,
      page: 1,
      status: undefined,
    });
    if (searchRef.current) {
      searchRef.current.value = "";
    }
  };

  const statusAutocomplete = useCustomAutocomplete({
    list: {
      options: TourStatuses,
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
    const url = new URL(`${baseUrl}/api/v1/tours/search/admin`);
    url.searchParams.append("page", filter.page);
    url.searchParams.append("limit", pageSize);
    if (filter.status) {
      url.searchParams.append("status", filter.status.Value);
    }
    url.searchParams.append("search", filter.searchValue);
    url.searchParams.append("searchType", filter.searchType);

    try {
      const response = await fetch(url, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        pushError("Failed to get list tours");
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
    try {
      const url = new URL(`${baseUrl}/api/v1/tours/${partialTourUpdate._id}`);
      const formData = new FormData();
      formData.append("title", partialTourUpdate.title);
      formData.append("country", partialTourUpdate.country);
      formData.append("city", partialTourUpdate.city);
      formData.append("description", partialTourUpdate.description);
      formData.append("price", partialTourUpdate.price);
      formData.append("ageRange", partialTourUpdate.ageRange);
      formData.append("duration", partialTourUpdate.duration);
      formData.append("featured", partialTourUpdate.featured); // Include featured field
      if (partialTourUpdate.photo) {
        formData.append("photo", partialTourUpdate.photo);
      }
      const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        fetchTours();
        pushSuccess("Edit tour successfully");
      } else {
        pushError("Failed to edit tour");
        throw new Error("Failed to edit tour");
      }
    } catch (error) {
      pushError("Failed to edit tour");
    }
  };

  const handleAddTour = async ({ tour, avatar }) => {
    try {
      const formData = new FormData();
      formData.append("title", tour.title);
      formData.append("country", tour.country);
      formData.append("city", tour.city);
      formData.append("description", tour.description);
      formData.append("price", tour.price);
      formData.append("ageRange", tour.ageRange);
      formData.append("duration", tour.duration);
      formData.append("featured", tour.featured);
      if (avatar) {
        formData.append("photo", avatar);
      }

      const response = await fetch(`${baseUrl}/api/v1/tours`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        fetchTours(); // Refresh the tour list after successful addition
        pushSuccess("Added new tour successfully");
        setAddOpen(false); // Close the popup after successful addition
      } else {
        pushError("Failed to add new tour");
        throw new Error("Failed to add new tour");
      }
    } catch (error) {
      pushError("Failed to add new tour");
    }
  };

  const handleHideConfirm = async (tourId) => {
    try {
      const url = new URL(`${baseUrl}/api/v1/tours/hide/${tourId}`);
      const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        pushSuccess("Hide tour successfully");
        fetchTours();
      } else {
        pushError("Failed to hide tour");
      }
    } catch (error) {
      pushError("Failed to hide tour");
    }
  };

  const handleUnhideConfirm = async (tourId) => {
    try {
      const url = new URL(`${baseUrl}/api/v1/tours/unhide/${tourId}`);
      const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        pushSuccess("Unhide tour successfully");
        fetchTours();
      } else {
        pushError("Failed to unhide tour");
      }
    } catch (error) {
      pushError("Failed to unhide tour");
    }
  };

  useEffect(() => {
    fetchTours();
  }, [filter.page, filter.searchValue, filter.status, filter.searchType]);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
      }}
    >
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
              {tourSearchType.map((type) => (
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
        renderItem={(tour) => (
          <TourItem
            key={tour._id}
            tour={tour}
            statusFilter={filter.status}
            handleUpdateTour={handleUpdateTour}
            handleHideConfirm={(postId) => handleHideConfirm(postId)}
            handleUnhideConfirm={(postId) => handleUnhideConfirm(postId)}
          />
        )} // Pass statusFilter to TourItem
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
