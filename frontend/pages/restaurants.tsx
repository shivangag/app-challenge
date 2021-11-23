import { NextPage } from "next"
import { useEffect, useState } from "react"
import MaterialTable, { Column } from "material-table"
import { Snackbar } from "@mui/material"
import { analytics } from '../util/firebase'
import { logEvent } from 'firebase/analytics'

const Restaurants: NextPage = () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const [TOKEN, setTOKEN] = useState<any>("")
    const [headerOptions, setHeaderOptions] = useState<any>({
        'Content-Type': 'application/json',
        'Authorization': `Bearer`,
    })

    const [open, setOpen] = useState({
        open: false,
        message: ""
    });
    const [usersTableData, setUsersTableData] = useState<string[]>([])
    const [tableData, setTableData] = useState([])

    useEffect(() => {
        async function callCustomFunc() {
            await setHeaderOptions({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
            })
            setTOKEN(localStorage.getItem("accessToken"))
        }
        callCustomFunc()
    }, [])

    useEffect(() => {
        if (TOKEN) {
            fetchUser();
            fetchRestaurants();
        }
    }, [TOKEN])

    const columns: Column<never>[] = [
        { title: "Name", field: "name", validate: (rowData: { name: string }) => (rowData.name && (rowData.name.length < 6 || rowData.name.length > 30)) ? 'Name should contain 6-30 characters' : '' || (rowData.name === '' || !rowData.name) ? { isValid: false, helperText: 'Required' } : true },
        { title: "Address", field: "address", validate: (rowData: { address: string }) => (rowData.address && (rowData.address.length < 6 || rowData.address.length > 50)) ? 'Address should contain 6-50 characters' : '' || (rowData.address === '' || !rowData.address) ? { isValid: false, helperText: 'Required' } : true },
        { title: "Country", field: "country", validate: (rowData: { country: string }) => (rowData.country && (rowData.country.length < 3 || rowData.country.length > 30)) ? 'Name should contain 3-30 characters' : '' || (rowData.country === '' || !rowData.country) ? { isValid: false, helperText: 'Required' } : true },
        { title: "Latitude", field: "lat", validate: (rowData: { lat: number }) => ((rowData.lat && (rowData.lat < -90 || rowData.lat > 90)) ? 'Latitude must be between -90 and 90 degrees inclusive' : '') || (isNaN(rowData.lat) ? 'Latitude should be in number format' : '') || ((rowData.lat === null || !rowData.lat) ? { isValid: false, helperText: 'Required' } : true) },
        { title: "Longitude", field: "long", validate: (rowData: { long: number }) => ((rowData.long && (rowData.long < -180 || rowData.long > 180)) ? 'Longitude must be between -180 and 180 degrees inclusive' : '') || (isNaN(rowData.long) ? 'Longitude should be in number format' : '') || ((rowData.long === null || !rowData.long) ? { isValid: false, helperText: 'Required' } : true) },
        { title: "User", field: "user_id", lookup: usersTableData, validate: (rowData: { user_id: string }) => (rowData.user_id === '' || !rowData.user_id) ? { isValid: false, helperText: 'Required' } : true },
    ]

    // get all created user list
    const fetchUser = async () => {
        const response = await fetch(API_BASE_URL + '/user/all', {
            method: 'GET',
            cache: 'no-cache',
            headers: headerOptions,
        });
        const data = await response.json();
        const usersData: string[] = []
        data.length > 0 && data.map((ele: any) => usersData[ele.id] = ele.name)
        setUsersTableData(usersData)
    }

    // get all restaurants list
    const fetchRestaurants = async () => {
        const response = await fetch(API_BASE_URL + '/restaurant/all', {
            method: 'GET',
            cache: 'no-cache',
            headers: headerOptions,

        });
        const data = await response.json();
        setTableData(data)
    }

    //create restaurant 
    const createRestaurant = async (_payload: any) => {
        let status = false;
        const response = await fetch(API_BASE_URL + '/restaurant/add', {
            method: 'POST',
            cache: 'no-cache',
            headers: headerOptions,
            body: JSON.stringify(_payload),
        }).then(handleErrors)
            .then(response => {
                status = true
                fetchRestaurants();
                toaster({
                    message: 'Restaurant Created Successfully',
                })
                logEvent(analytics,'restaurant_created',_payload)
            })
            .catch(error => console.log(error));
        return status;
    }

    //update existing restaurant
    const updateRestaurant = async (_payload: any) => {
        let status = false;
        const response = await fetch(API_BASE_URL + `/restaurant/${_payload.id}`, {
            method: 'PUT',
            cache: 'no-cache',
            headers: headerOptions,
            body: JSON.stringify(_payload),
        }).then(handleErrors)
            .then(response => {
                status = true
                fetchRestaurants();
                toaster({
                    message: 'Restaurant Updated Successfully',
                })
                logEvent(analytics,'restaurant_updated',_payload)
            })
            .catch(error => console.log(error));
        return status;
    }

    //deleting existing restaurant 
    const deactivateRestaurant = async (_payload: any) => {
        let status = false;
        const response = await fetch(API_BASE_URL + `/restaurant/delete/${_payload.id}`, {
            method: 'DELETE',
            cache: 'no-cache',
            headers: headerOptions,
            body: JSON.stringify(_payload),
        }).then(handleErrors)
            .then(response => {
                status = true
                fetchRestaurants();
                toaster({
                    message: 'Restaurant Deleted Successfully',
                })
                logEvent(analytics,'restaurant_deleted',_payload)
            })
            .catch(error => console.log(error));
        return status;
    }

    // error handling
    const handleErrors = async (response: any) => {
        if (!response.ok) {
            toaster({
                message: response.statusText,
            })
        }
        return response;
    }

    const toaster = (newState: any) => {
        setOpen({ open: true, ...newState });
    };

    const handleClose = (newState: any) => {
        setOpen({ open: false, ...newState });
    };

    return (
        <div>
            <main className="main-body">
                <MaterialTable data={tableData} columns={columns}
                    editable={{
                        onRowAdd: (newRow) => new Promise(async (resolve, reject) => {
                            var resp = await createRestaurant(newRow)
                            if (resp) {
                                fetchRestaurants();
                            }
                            setTimeout(() => resolve(true), 500)
                        }),
                        onRowUpdate: (newRow, oldRow) => new Promise(async (resolve, reject) => {
                            var resp = await updateRestaurant(newRow)
                            if (resp) {
                                fetchRestaurants();
                            }
                            setTimeout(() => resolve(true), 500)
                        }),
                        onRowDelete: (selectedRow) => new Promise(async (resolve, reject) => {
                            var resp = await deactivateRestaurant(selectedRow)
                            if (resp) {
                                fetchRestaurants();
                            }
                            setTimeout(() => resolve(true), 1000)
                        })
                    }}

                    options={{
                        search: false,
                        actionsColumnIndex: -1,
                        filtering: false,
                        paging: true,
                        pageSizeOptions: [10, 20, 50, 100, 500],
                        pageSize: 10,
                        addRowPosition: "first"
                    }}
                    title="Restaurants List"
                />

                <Snackbar
                    open={open.open}
                    autoHideDuration={2000}
                    onClose={handleClose}
                    message={open.message}
                />
            </main>
        </div>
    )
}

export default Restaurants