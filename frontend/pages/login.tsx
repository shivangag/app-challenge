import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import React, { useState } from 'react'
import { Snackbar } from '@mui/material'
import { useRouter } from 'next/router'

const Login: NextPage = (props: any) => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const [form, setForm] = useState({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    })
    const [open, setOpen] = useState({
        open: false,
        message: ""
    });

    // headers with static authtoken
    const headerOptions = {
        'Content-Type': 'application/json'
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!form.email || form.email === "") {
            setErrors({
                ...errors,
                email: 'Email is required'
            })
        }
        if (!form.password || form.password === "") {
            setErrors({
                ...errors,
                password: 'Password is required'
            })
        }
        if (errors.email || errors.password) {
            return
        }
        login(form)
    }

    // login 
    const login = async (_payload: any) => {
        const response = await fetch(API_BASE_URL + '/auth/login', {
            method: 'POST',
            cache: 'no-cache',
            headers: headerOptions,
            body: JSON.stringify(_payload),
        })
        const data = await response.json();

        if (data.error) {
            toaster({
                message: data.message,
            })
        } else {
            toaster({
                message: "Login Successfully",
            })
            localStorage.setItem("accessToken", data.token)
            window.location.href = "/"
        }
    }

    const toaster = (newState: any) => {
        setOpen({ open: true, ...newState });
    };

    const handleClose = (newState: any) => {
        setOpen({ open: false, ...newState });
    };

    const handleEmailChange = (e: any) => {
        if (!e.target.value || e.target.value === "") {
            setErrors({
                ...errors,
                email: 'Email is required'
            })
        } else {
            setErrors({
                ...errors,
                email: ''
            })
        }
        setForm({ ...form, email: e.target.value })
    }

    const handlePasswordChange = (e: any) => {
        if (!e.target.value || e.target.value === "") {
            setErrors({
                ...errors,
                password: 'Password is required'
            })
        } else {
            setErrors({
                ...errors,
                password: ''
            })
        }
        setForm({ ...form, password: e.target.value })
    }

    return (
        // <div className={styles.container}>
        <main className={styles.main}>
            <form className="commentForm" onSubmit={handleSubmit}>
                <div className="form-control">
                    <input
                        className="input-text-box"
                        type="text"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => handleEmailChange(e)}
                    />
                    <p className="input-errors">{errors.email}</p>
                </div>
                <div className="form-control">
                    <input
                        className="input-text-box"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => handlePasswordChange(e)}
                    />
                    <p className="input-errors">{errors.password}</p>
                </div>
                <div className="form-btn">
                    <input type="submit" value="Submit" />
                </div>
            </form>

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

export default Login
