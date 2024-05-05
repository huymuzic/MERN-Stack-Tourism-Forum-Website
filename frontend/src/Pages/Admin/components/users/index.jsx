import { useCallback, useEffect, useRef, useState } from "react";
import BaseList from "../BaseList";
import WrapperFilter from "../WrapperFilter";
import UserItem from "./UserItem";
import debounce from "../../../../helper";
import NoData from "../NoData";


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


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Construct the URL with query parameters
        const url = new URL('http://localhost:4000/api/v1/users/list');
        url.searchParams.append('page', filter.page);
        url.searchParams.append('limit', pageSize);
        // url.searchParams.append('status', 'active'); 
        url.searchParams.append('search', filter.searchValue);
        url.searchParams.append('searchType', filter.searchType.value);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setPaging(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [filter]);
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
      {
        paging?.data?.length === 0 ? <NoData>
          No data
        </NoData> : <BaseList
          titleTotal="Total users"
          totalItems={paging.totalCount}
          list={paging.data}
          loading={loading}
          renderItem={(user) => <UserItem key={user.id} user={user} />}
          totalPages={Math.ceil(paging.totalCount / pageSize)}
          page={filter.page}
          onChangePage={(page) => setFilter((prev) => ({ ...prev, page }))}
        />
      }
    </div >
  );
}
