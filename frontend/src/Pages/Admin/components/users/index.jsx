import { useCallback, useEffect, useRef, useState } from "react";
import BaseList from "../BaseList";
import WrapperFilter from "../WrapperFilter";
import UserItem from "./UserItem";
import debounce from "../../../../helper";
import { pushError, pushSuccess } from "../../../../components/Toast";


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
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    searchType: userSearchTypes[0],
    page: 1,
    searchValue: '',
  });
  const [paging, setPaging] = useState({
    data: [],
    totalCount: 0
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

  const handleLockConfirm = async (userId) => {
    try {
      const url = new URL(`${import.meta.env.VITE_BASE_URL}/api/v1/users/lock/${userId}`);
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        pushSuccess('Lock user successfully');
        fetchUsers()
      } else {
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
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        pushSuccess('Unlock user successfully');
        fetchUsers()
      } else {
        throw new Error('Failed to unlock user');
      }
    } catch (error) {
      pushError('Failed to unlock user');
    }
  };
  const fetchUsers = async () => {
    const url = new URL(`${import.meta.env.VITE_BASE_URL}/api/v1/users/list`);
    url.searchParams.append('page', filter.page);
    url.searchParams.append('limit', pageSize);
    // url.searchParams.append('status', filter.status);
    url.searchParams.append('search', filter.searchValue);
    url.searchParams.append('searchType', filter.searchType);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    const data = await response.json();
    setPaging(data);
    setLoading(false);

    return fetch(url)
      .then((response) => {
        setLoading(true)
        return response.json();
      })
      .then((data) => {
        setPaging(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      })
  };
  useEffect(() => {
    fetchUsers();
  }, [filter.page, filter.searchValue]);
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "32px" }}>
      <WrapperFilter onReset={handleResetFilter}>
        <div className="d-flex flex-row justify-content-space-between pt-3 pb-3">
          <div className="input-group" style={{ width: "50%" }}>
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
          <div>

          </div>
        </div>
      </WrapperFilter >

      <BaseList
        titleTotal="Total users"
        totalItems={paging.totalCount}
        list={paging.data}
        loading={loading}
        renderItem={(user) => <UserItem key={user.id} user={user} handleLockConfirm={(userId) => handleLockConfirm(userId)} handleUnLockConfirm={(userId) => handleUnLockConfirm(userId)} />}
        totalPages={Math.ceil(paging.totalCount / pageSize)}
        page={filter.page}
        onChangePage={(page) => setFilter((prev) => ({ ...prev, page }))}
      />

    </div >
  );
}
