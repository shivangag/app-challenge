import { NextPage } from "next"
import { useEffect, useState } from "react"
import MaterialTable, { Column } from "material-table"
import { Snackbar } from "@mui/material"
import { analytics } from '../util/firebase'
import { logEvent } from 'firebase/analytics'

const Users: NextPage = () => {
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
        }
    }, [TOKEN])

    const columns: Column<never>[] = [
        { title: "Name", field: "name", validate: (rowData: { name: string }) => (rowData.name && (rowData.name.length < 6 || rowData.name.length > 12)) ? 'Name should contain 6-12 characters' : '' || (rowData.name === '' || !rowData.name) ? { isValid: false, helperText: 'Required' } : true },
        { title: "Phone Number", field: "phoneNumber", validate: (rowData: { phoneNumber: number }) => (rowData.phoneNumber && !String(rowData.phoneNumber).match(/^\d{10}$/)) ? 'Phone Number should be 10 digits long' : '' || (rowData.phoneNumber === null || !rowData.phoneNumber) ? { isValid: false, helperText: 'Required' } : true },
        { title: "Email", field: "email", validate: (rowData: { email: string }) => (rowData.email && !rowData.email.match(/^\S+@\S+\.\S+$/)) ? 'Invalid Email' : '' || (rowData.email === '' || !rowData.email) ? { isValid: false, helperText: 'Required' } : true },
    ]

    // get all created user list
    const fetchUser = async () => {
        const response = await fetch(API_BASE_URL + '/user/all', {
            method: 'GET',
            cache: 'no-cache',
            headers: headerOptions,
        });
        const data = await response.json();
        setTableData(data)
    }

    //create user 
    const createUser = async (_payload: any) => {
        _payload["properties"] = "user"
        let status = false;
        const response = await fetch(API_BASE_URL + '/auth/signup', {
            method: 'POST',
            cache: 'no-cache',
            headers: headerOptions,
            body: JSON.stringify(_payload),
        }).then(handleErrors)
            .then(response => {
                status = true;
                fetchUser();
                toaster({
                    message: 'User Created Successfully',
                })
                logEvent(analytics,'user_created',_payload)
            })
            .catch(error => console.log(error));
        return status;
    }

    //update existing  user 
    const updateUser = async (_payload: any) => {
        let status = false;
        const response = await fetch(API_BASE_URL + `/user/${_payload.uuid}`, {
            method: 'PUT',
            cache: 'no-cache',
            headers: headerOptions,
            body: JSON.stringify(_payload),
        }).then(handleErrors)
            .then(response => {
                status = true
                fetchUser();
                toaster({
                    message: 'User Updated Successfully',
                })
                logEvent(analytics,'user_updated',_payload)
            })
            .catch(error => console.log(error));
        return status;
    }

    //deleting existing  user 
    const deactivateUser = async (_payload: any) => {
        let status = false;
        const response = await fetch(API_BASE_URL + `/user/delete/${_payload.uuid}`, {
            method: 'DELETE',
            cache: 'no-cache',
            headers: headerOptions,
            body: JSON.stringify(_payload),
        }).then(handleErrors)
            .then(response => {
                console.log("response", response)
                status = true
                fetchUser();
                toaster({
                    message: 'User Deleted Successfully',
                })
                logEvent(analytics,'user_deleted',_payload)
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
        // <div>
        <main className="main-body">
            <MaterialTable data={tableData} columns={columns}
                editable={{
                    onRowAdd: (newRow) => new Promise(async (resolve, reject) => {
                        var resp = await createUser(newRow)
                        if (resp) {
                            fetchUser();
                        }
                        setTimeout(() => resolve(true), 500)
                    }),
                    onRowUpdate: (newRow, oldRow) => new Promise(async (resolve, reject) => {
                        var resp = await updateUser(newRow)
                        if (resp) {
                            fetchUser();
                        }
                        setTimeout(() => resolve(true), 500)
                    }),
                    onRowDelete: (selectedRow) => new Promise(async (resolve, reject) => {
                        var resp = await deactivateUser(selectedRow)
                        if (resp) {
                            fetchUser();
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
                title="Users List"
            />

            <Snackbar
                open={open.open}
                autoHideDuration={2000}
                onClose={handleClose}
                message={open.message}
            />
        </main>
        // </div>
    )
}

export default Users