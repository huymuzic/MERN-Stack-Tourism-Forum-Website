import { useCallback, useEffect, useRef, useState } from "react";
import BasePaginationList from "../../../../components/BasePaginationList";
import WrapperFilter from "../WrapperFilter";
import UserItem, { userRoles, userStatuses } from "./UserItem";
import debounce from "../../../../helper";
import { pushError, pushSuccess } from "../../../../components/Toast";
import { useCustomAutocomplete } from "../../../../components/CustomAutocomplete/useCustomAutocomplete";
import CustomAutocomplete from "../../../../components/CustomAutocomplete/CustomAutocomplete";
import NoData from '../NoData'
import { headers } from "../../helper";

const userSearchTypes = [
  {
    id: 1,
    name: "Username",
    value: "username"
  },
  {
    id: 2,
    name: "Email",
    value: "email"
  }
]

export default function UsersList() {
  const pageSize = 5;
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    searchType: userSearchTypes[0],
    page: 1,
    searchValue: '',
    status: undefined
  });
  const [paging, setPaging] = useState({
    data: [],
    totalCount: 0,
    totalPages: 0
  })

  const searchRef = useRef(null);
  const searchTypeRef = useRef(null);

  const handleResetFilter = () => {
    setFilter({ searchValue: '', searchType: userSearchTypes[0], page: 1 });
    if (searchRef.current) {
      searchRef.current.value = '';
    }
  };
  const handleOnChangeSearch = useCallback(
    debounce((value) => {
      setFilter((prev) => ({ ...prev, searchValue: value, page: 1 }));
    }, 300),
    []
  );
  const handleOnChangeStatus = (c) => {
    setFilter((prev) => ({ ...prev, status: c, page: 1 }));
  }
  const handleOnChangeRole = (r) => {
    setFilter((prev) => ({ ...prev, role: r, page: 1 }));
  }

  const handleLockConfirm = async (userId) => {
    try {
      const url = new URL(`${import.meta.env.VITE_BASE_URL}/api/v1/users/lock/${userId}`);
      const response = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',},
      });
      if (response.ok) {
        pushSuccess('Lock user successfully');
        fetchUsers()
      } else {
        pushError('Failed to lock user');
        throw new Error('Failed to lock user');
      }
    } catch (error) {
      pushError('Failed to lock user');
    }
  };

  const handleUnLockConfirm = async (userId) => {
    try {
      const url = new URL(`${import.meta.env.VITE_BASE_URL}/api/v1/users/unlock/${userId}`);
      const response = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',},
      });
      if (response.ok) {
        pushSuccess('Unlock user successfully');
        fetchUsers()
      } else {
        pushError('Failed to unlock user');
        throw new Error('Failed to unlock user');
      }
    } catch (error) {
      pushError('Failed to unlock user');
    }
  };
  const fetchUsers = async () => {
    setLoading(true)
    const url = new URL(`${import.meta.env.VITE_BASE_URL}/api/v1/users/list`);
    url.searchParams.append('page', filter.page);
    url.searchParams.append('limit', pageSize);
    if (filter.status) {
      url.searchParams.append('status', filter.status.Value)
    }
    if (filter.role) {
      url.searchParams.append('role', filter.role.Value)
    }
    url.searchParams.append('search', filter.searchValue);
    url.searchParams.append('searchType', filter.searchType);

    return fetch(url, { headers })
      .then((response) => {
        if (!response.ok) {
          pushError('Failed to get list user');
        }
        return response.json();
      })
      .then((data) => {
        setPaging(data);
      })
      .catch((error) => {
        console.log("🚀 ~ fetchUsers ~ error:", error)
        setLoading(false);
      }).finally(() => setLoading(false))
  };
  useEffect(() => {
    fetchUsers();
  }, [filter.page, filter.searchValue, filter.status, filter.role]);


  const statusAutocomplete = useCustomAutocomplete({
    list: {
      options: userStatuses,
      searchFields: ['Name'],
    },
  });

  const roleAutocomplete = useCustomAutocomplete({
    list: {
      options: userRoles,
      searchFields: ['Name']
    }
  })
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "32px" }}>
      <WrapperFilter onReset={handleResetFilter} customAction={
        <div className="input-group ps-4" >
          <select className="form-select" style={{ maxWidth: '140px', width: "25%", cursor: "pointer" }} ref={searchTypeRef} onChange={(e) => {
            setFilter((prev) => {
              return ({ ...prev, searchType: e.target.value })
            })
          }}>
            {userSearchTypes.map(type => (
              <option key={type.value} value={type.value}>{type.name}</option>
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
      }>
        <div className="d-flex flex-row justify-content-space-between pt-3 pb-3">

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
          <div className="ps-4" style={{ width: "50%" }}>
            <CustomAutocomplete
              {...roleAutocomplete}
              getOptionLabel={(o) => o.Name}
              label={"Roles"}
              value={filter.role}
              placeholder={"All roles"}
              onChange={(r) => {
                handleOnChangeRole(r);
              }}
            />
          </div>


        </div>
      </WrapperFilter >
      <BasePaginationList
        titleTotal="Total users"
        totalItems={paging.totalCount}
        list={paging.data}
        loading={loading}
        renderItem={(user) => <UserItem key={user.id} user={user} handleLockConfirm={(userId) => handleLockConfirm(userId)} handleUnLockConfirm={(userId) => handleUnLockConfirm(userId)} />}
        totalPages={paging.totalPages}
        page={filter.page}
        onChangePage={(page) => setFilter((prev) => ({ ...prev, page }))}
        renderEmpty={() => <NoData>No Data</NoData>}
      />
    </div >
  );
}
