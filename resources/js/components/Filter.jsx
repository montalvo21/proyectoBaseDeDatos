import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';

const API_URL = "http://localhost:8000/";


function Filter() {
    const [usuarios, setUsuarios] = useState([]);
    const [resultSet, setResultSet] = useState([]);
    const [searchType, setSearchType] = useState("first_name");
    const [searchInput, setSearchInput] = useState("");
    const [addUser, setAddUser] = useState(false);

    const [userId, setUserId] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPhone, setUserPhone] = useState("");

    const idRef = useRef();
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const emailRef = useRef();
    const phoneRef = useRef();

    // CRUD: READ
    // get all users
    useEffect(() => {
        fetch(API_URL.concat("user"))
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setUsuarios(data);
                setResultSet(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    // handling when select changes
    const onSelectTypeChange = (event) => {
        setSearchType(event.target.value);
        doFilter();
    }

    // handling when input changes
    const onSearchInputChange = (event) => {
        setSearchInput(event.target.value);
        doFilter();
    }

    const doFilter = () => {
        let result = [];
        switch (searchType) {
            case "first_name": 
                result = getUserByFirstName();
                break;
            case "last_name":
                result = getUserByLastName();
                break;
            case "email":
                result = getUserByEmail();
                break;
            case "phone_number":
                result = getUserByPhoneNumber();
                break;
            default:
                result = usuarios;
                break;
        }
        setResultSet(result);
    }

    const getUserByFirstName = () => {
        console.log(searchInput);
        return usuarios.filter(user => 
            user.first_name.toLowerCase().includes(searchInput.toLowerCase()) || searchInput.toLowerCase().includes(user.first_name.toLowerCase()));
    }

    const getUserByLastName = () => {
        return usuarios.filter(user => 
            user.last_name.toLowerCase().includes(searchInput.toLowerCase()) || searchInput.toLowerCase().includes(user.last_name.toLowerCase()));
    }

    const getUserByEmail = () => {
        return usuarios.filter(user => user.email.toLowerCase().includes(searchInput.toLowerCase()));
    }

    const getUserByPhoneNumber = () => {
        return usuarios.filter(user => user.phone_number.toLowerCase().includes(searchInput.toLowerCase()));
    }


    // CRUD: DELETE user
    const deleteUser = (id) => {
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const requestOptions = {
            method: 'DELETE',
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRF-TOKEN": token
        };
        fetch(API_URL+`user/${id}`, requestOptions)
            .catch((err) => {
                console.log(err.message);
            });
        window.location.reload(false);
    }

    // CRUD: CREATE user or
    // CRUD: UPDATE
    const saveUser = (event) => {
        event.preventDefault();
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const isEdit =  idRef.current.value != '';
        let user = {
            "first_name": firstNameRef.current.value,
            "last_name": lastNameRef.current.value,
            "email": emailRef.current.value,
            "phone_number": phoneRef.current.value
        };

        if (isEdit) {
            user["id"] = idRef.current.value;
        }

        const requestOptions = {
            method: isEdit ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRF-TOKEN": token
        };

        const url = isEdit ? API_URL+`user/${user.id}` : API_URL+`user`;
        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
        window.location.reload(false);
    };

    const editUser = (id) => {
        // show edit view
        setAddUser(true);

        let user = {};
        fetch(API_URL+`user/${id}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            user = data;
            setUserId(user.id);
            setFirstName(user.first_name);
            setLastName(user.last_name);
            setUserEmail(user.email);
            setUserPhone(user.phone_number);
        })
        .catch((err) => {
            console.log(err.message);
        });
    }
    
    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-8">
                    <div className="row">
                        <div className="col">
                            <h2>Filtrando Usuarios</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4">
                            <div class="row"> 
                                <label for="filtro-select" class="col-4 col-form-label">Filtrar Por:</label>
                                <div className="col-8"> 
                                    <select defaultValue={searchType} className="form-select" id="filtro-select" onChange={onSelectTypeChange}>
                                        <option value="first_name">First Name</option>
                                        <option value="last_name">Last Name</option>
                                        <option value="email">Email</option>
                                        <option value="phone_number">Phone Number</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-3">
                            <input type="text" defaultValue={searchInput}  className="input-group-text" onInput={onSearchInputChange} />
                        </div>
                        <div className="col-2">
                            <button className="btn btn-primary" onClick={() => { setAddUser(true); setUserId("")}}>Agregar User</button>
                        </div>
                    </div>
                </div>
            </div>
            { 
                addUser && <>
                    <hr />
                    <div className="row justify-content-center">
                        <div className="col-8">
                        { userId == "" && <h3>Agregar Usuario</h3>}
                        { userId != "" && <h3>Editar Usuario</h3>}

                            <form onSubmit={saveUser}>
                                <div className="row justify-content-center">
                                    <input type="hidden" defaultValue={userId} ref={idRef}></input>
                                    <label for="first-name" className="col-2 col-form-label">First Name</label>
                                    <div className="col-4"> 
                                        <input className="form-input" id="first-name" defaultValue={firstName} ref={firstNameRef} />
                                    </div>
                                    <label for="last-name" className="col-2 col-form-label">Last Name</label>
                                    <div className="col-4"> 
                                        <input className="form-input" id="last-name" defaultValue={lastName} ref={lastNameRef} />
                                    </div>
                                </div>
                                <div className="row justify-content-center"> 
                                    <label for="user-email" className="col-2 col-form-label">Email</label>
                                    <div className="col-4"> 
                                        <input className="form-input" id="user-email" defaultValue={userEmail} ref={emailRef} />
                                    </div>
                                    <label for="user-phone" className="col-2 col-form-label">Phone Number</label>
                                    <div className="col-4"> 
                                        <input className="form-input" id="user-phone" defaultValue={userPhone} ref={phoneRef} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-2">
                                        <button type="submit" className="btn btn-success">Save</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            }
            <hr />
            <div className="row justify-content-center">
                <div className="col-md-8" id="filter-result">
                    {resultSet.length == 0 && <p>Nada por aqui...</p>}
                    { resultSet.length > 0 &&
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    resultSet.length > 0 && resultSet.map((user) => 
                                        <tr>
                                            <td>{user.id}</td>
                                            <td>{user.first_name}</td>
                                            <td>{user.last_name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone_number}</td>
                                            <td>
                                                <button className="btn btn-primary mr-2" onClick={() => editUser(user.id)}>Edit</button>
                                                <button className="btn btn-danger" onClick={() => deleteUser(user.id)}>Delete</button>
                                            </td>
                                        </tr>
                                        ) 
                                }
                            </tbody>
                        </table>
                    }
                </div>
            </div>
        </div>
    );
}

export default Filter;

if (document.getElementById('filter')) {
    const Index = ReactDOM.createRoot(document.getElementById("filter"));

    Index.render(
        <React.StrictMode>
            <Filter/>
        </React.StrictMode>
    )
}
