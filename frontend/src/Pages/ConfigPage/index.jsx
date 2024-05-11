import React, { useState } from 'react'
import { Button, Container, FloatingLabel, Form, Stack } from 'react-bootstrap'
import { pushError, pushSuccess } from '../../components/Toast'
import CustomPagination from '../../components/CustomPagination'
import { usePopUp } from '../../components/pop-up/usePopup'
import PopUpBase from '../../components/pop-up/PopUpBase'
import BasePaginationList from '../../components/BasePaginationList'
import CustomTooltip from '../../components/CustomTooltip'
import { FaUnlock } from 'react-icons/fa'
import CircularProgress from '../../components/CircularProgress'
import CustomAutocomplete from '../../components/CustomAutocomplete/CustomAutocomplete'
import { useCustomAutocomplete } from '../../components/CustomAutocomplete/useCustomAutocomplete'


const userStatuses = [
  { Id: 1, Value: "active", Name: "Active", bgColor: "#C8E6C9", color: "green" },
  { Id: 2, Value: "inactive", Name: "Inactive", bgColor: "#F5F5F5", color: "grey" }
];
export default function ConfigPage() {
  const popUpConfig = usePopUp()
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState()

  const sampleData = {
    rows: [
      { Name: 'Data test 1' },
      { Name: 'Data test 2' },
      { Name: 'Data test 3' },
      { Name: 'Data test 4' },
      { Name: 'Data test 5' },
    ],
    totalPages: 2,
  }


  const statusAutocomplete = useCustomAutocomplete({
    list: {
      options: userStatuses,
      searchFields: ['Name'],
    },
  });
  return (
    <Container >
      <Stack gap={5}>

        <Stack gap={2}>
          <h4>Typography</h4>
          <Stack gap={3} direction='horizontal'>
            <h1>Heading 1</h1>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <h4>Heading 4</h4>
            <h5>Heading 5</h5>
            <h6>Heading 6</h6>
            <p className='body-1'>Body 1</p>
            <p className='body-2'>Body 2</p>
          </Stack>
        </Stack>

        <Stack gap={2}>
          <h4>Button</h4>
          <Stack gap={3} direction='horizontal'>
            <Button variant='primary'>Primary</Button>
            <Button variant='secondary'>Confirm</Button>
            <Button variant='danger'>Cancel</Button>
            <Button variant='outline-primary'>Outlined Primary</Button>
            <Button variant='outline-danger'>Outlined Danger</Button>
          </Stack>
        </Stack>

        <Stack gap={2}>
          <h4>TextField</h4>
          <Stack style={{ maxWidth: "524px" }}>
            <FloatingLabel
              label="Email address"
            >
              <Form.Control type="email" placeholder="name@example.com" />
            </FloatingLabel>
          </Stack>
        </Stack>

        <Stack gap={2}>
          <h4>Toastify</h4>
          <Stack direction='horizontal' gap={2}>
            <Button variant="outline-primary" onClick={() => pushSuccess('Show Toast Success !')}>
              Push success
            </Button>
            <Button variant="outline-danger" color="error" onClick={() => pushError('Show Toast Error !')}>
              Push error
            </Button>
          </Stack>
        </Stack>

        <Stack gap={2}>
          <h4>Pagination</h4>

          <CustomPagination totalPages={10} currentPage={1} onChange={() => { }} />
        </Stack>

        <Stack gap={2}>
          <h4>Popup</h4>
          <Button variant="outline-primary" onClick={() => popUpConfig.setTrue()} style={{ maxWidth: "200px" }}>
            Show popup
          </Button>

          <PopUpBase
            {...popUpConfig}
            title={'Confirm'}
            onConfirm={() => {
              pushSuccess("Confirm!")
              popUpConfig.onClose();
            }}
            desc={<Stack gap={3}>
              <FloatingLabel
                label="Email address"
              >
                <Form.Control type="email" placeholder="name@example.com" />
              </FloatingLabel>

              <FloatingLabel
                label="Username"
              >
                <Form.Control type="text" placeholder="username" />
              </FloatingLabel>
            </Stack>}
          />

        </Stack>
        <Stack gap={2}>
          <h4>Base Pagination List</h4>

          <BasePaginationList
            titleTotal="Total users"
            totalItems={sampleData.rows.length}
            list={sampleData.rows}
            totalPages={10}
            renderItem={(item) => <Stack key={item.id} item={item} style={{ border: "1px solid #ddd", padding: "8px", marginBottom: "8px" }}>{item.Name}</Stack>}
            page={page}
            onChangePage={setPage}

          />
        </Stack>

        <Stack gap={2}>
          <h4>Tooltip</h4>

          <CustomTooltip text="Config" position={"top"}>
            <Button variant='primary'><FaUnlock color="inherit" /></Button>
          </CustomTooltip>
        </Stack>
        <Stack gap={2}>
          <h4>Circular Progress</h4>

          <CircularProgress />
        </Stack>

        <Stack gap={2}>
          <h4>Autocomplete</h4>

          <CustomAutocomplete
            {...statusAutocomplete}
            getOptionLabel={(o) => o.Name}
            label={"Statuses"}
            placeholder={"All statuses"}
            value={status}
            onChange={(s) => {
              setStatus(s)
            }}
          />
        </Stack>
      </Stack>
    </Container>
  )
}
