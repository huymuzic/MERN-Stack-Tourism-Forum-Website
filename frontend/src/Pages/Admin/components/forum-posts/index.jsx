import { useCallback, useEffect, useRef, useState } from "react";
import BasePaginationList from "../../../../components/BasePaginationList";
import WrapperFilter from "../WrapperFilter";
import { pushError, pushSuccess } from "../../../../components/Toast";
import { headers } from "../../helper";
import ForumItem, {postStatuses } from "./ForumItem";
import NoData from "../NoData";
import debounce from "../../../../helper";
import { useCustomAutocomplete } from "../../../../components/CustomAutocomplete/useCustomAutocomplete";
import CustomAutocomplete from "../../../../components/CustomAutocomplete/CustomAutocomplete";

const forumPostSearchType = [
  {
    id: 1,
    name: "Content",
    value: "content"
  },
  {
    id: 2,
    name: "Author",
    value: "author"
  }
]
export default function ForumPostsList() {
  const pageSize = 5;
  const [filter, setFilter] = useState({
    page: 1,
    searchValue: '',
    status: undefined
  });
  const [paging, setPaging] = useState({
    data: [],
    totalCount: 0,
    totalPages: 0
  })
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const searchTypeRef = useRef(null);
  const handleResetFilter = () => {
    setFilter({ searchValue: '', searchType: forumPostSearchType[0], page: 1 });
    if (searchRef.current) {
      searchRef.current.value = '';
    }
  }
  const statusAutocomplete = useCustomAutocomplete({
    list: {
      options: postStatuses,
      searchFields: ['Name'],
    },
  });
  const handleOnChangeSearch = useCallback(
    debounce((value) => {
      setFilter((prev) => ({ ...prev, searchValue: value, page: 1 }));
    }, 300),
    []
  );

  const fetchForumPosts = async () => {

    setLoading(true)
    const url = new URL(`${import.meta.env.VITE_BASE_URL}/api/v1/posts/list`);
    url.searchParams.append('page', filter.page);
    url.searchParams.append('limit', pageSize);
    if (filter.status) {
      url.searchParams.append('status', filter.status.Value)
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
        console.log("🚀 ~ .then ~ data:", data.data)
        setPaging(data);
      })
      .catch((error) => {
        console.log("🚀 ~ fetchUsers ~ error:", error)
        setLoading(false);
      }).finally(() => setLoading(false))
  }; 
  const handleLockConfirm = async (id) => {

    try {
      const url = new URL(`${import.meta.env.VITE_BASE_URL}/api/v1/posts/hide/${id}`);
      const response = await fetch(url, {
        method: 'PUT',
        headers: headers
      });
      if (response.ok) {
        pushSuccess('Hide post successfully');
        fetchForumPosts()
      } else {
        pushError('Failed to hide post');
        throw new Error('Failed to hide post');
      }
    } catch (error) {
      pushError('Failed to hide post');
    }
  };

  const handleOnChangeStatus = (c) => {
    setFilter((prev) => ({ ...prev, status: c, page: 1 }));
  }

 const handleUnLockConfirm = async (id) => {
    try {
      const url = new URL(`${import.meta.env.VITE_BASE_URL}/api/v1/posts/unhide/${id}`);
      const response = await fetch(url, {
        method: 'PUT',
        headers: headers
      });
      if (response.ok) {
        pushSuccess('Unhide post successfully');
        fetchForumPosts()
      } else {
        pushError('Failed to unhide post');
        throw new Error('Failed to unhide post');
      }
    } catch (error) {
      pushError('Failed to unhide post');
    }
  };
  useEffect(() => {
    fetchForumPosts();
  }, [filter.page, filter.searchValue, filter.status]);
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "32px" }}>
      <WrapperFilter onReset={handleResetFilter} customAction={
        <div className="input-group ps-4" >
          <select className="form-select" style={{ maxWidth: '140px', width: "25%", cursor: "pointer" }} ref={searchTypeRef} onChange={(e) => {
            setFilter((prev) => {
              return ({ ...prev, searchType: e.target.value })
            })
          }}>
            {forumPostSearchType.map(type => (
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
          </div>
      </WrapperFilter>


      <BasePaginationList
        titleTotal="Total forum posts"
        totalItems={paging.totalCount}
        list={paging.data}
        loading={loading}
        renderItem={(post) => <ForumItem key={post._id} post={post} handleLockConfirm={(id) => handleLockConfirm(id)} handleUnLockConfirm={(id) => handleUnLockConfirm(id)} />}
        totalPages={paging.totalPages}
        page={filter.page}
        onChangePage={(page) => setFilter((prev) => ({ ...prev, page }))}
        renderEmpty={() => <NoData>No Data</NoData>}
      />
    </div>
  )
}