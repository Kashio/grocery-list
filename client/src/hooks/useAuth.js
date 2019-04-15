import {useState, useEffect} from 'react';
import AuthApi from '../api/auth';
import {toast} from "react-toastify/index";
import Status from "../api/status";

export default function useAuth(setUser) {
    const [redirect, setRedirect] = useState(false);
    useEffect(() => {
        AuthApi
            .auth()
            .then(result => {
                if (result.status === Status.SUCCESS) {
                    setUser({username: result.username});
                    toast.success(result.username + ' authenticated successfully!', {
                        position: toast.POSITION.BOTTOM_LEFT
                    });
                } else {
                    throw result.message;
                }
            })
            .catch(error => {
                setRedirect(true);
                toast.error('failed to authenticate:\n' + error, {
                    position: toast.POSITION.BOTTOM_LEFT
                });
                console.error(error)
            });
    }, []);
    return redirect;
};