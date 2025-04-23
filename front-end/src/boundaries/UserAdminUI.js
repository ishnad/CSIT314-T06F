import React, { useState, useRef, useEffect } from 'react';

/**
 * Boundary class for user administration UI
 * Links to backend controller for user account creation
 */
class UserAdminUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            userProfile: '',
            response: null,
            error: null,
            dropdownOpen: false
        };
        this.dropdownRef = React.createRef();
    }

    /**
     * Get user input and send to backend
     * @param {string} username 
     * @param {string} password 
     * @param {string} userProfile
     * @returns {Promise<string>} Response message from server
     */
    getUserInput = async (username, password, userProfile) => {
        try {
            const res = await fetch('http://localhost:3001/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    username, 
                    password, 
                    userProfile 
                }),
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || 'Failed to create user');
            }

            this.setState({ response: data });
            return 'User created successfully';
        } catch (err) {
            this.setState({ error: err.message });
            return err.message;
        }
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    selectUserProfile = (type) => {
        this.setState({
            userProfile: type,
            dropdownOpen: false
        });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password, userProfile } = this.state;
        await this.getUserInput(username, password, userProfile.toUpperCase());
    };

    // Close dropdown when clicking outside
    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.dropdownRef.current && !this.dropdownRef.current.contains(event.target)) {
            this.setState({ dropdownOpen: false });
        }
    };

    render() {
        const { username, password, userProfile, response, error, dropdownOpen } = this.state;

        return (
            <div className="wire-frame-container">
                <form onSubmit={this.handleSubmit} className="create-user-form">
                    <h2 className="form-heading">Create User Account</h2>
                    
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input 
                            type="text" 
                            id="username"
                            name="username"
                            value={username}
                            onChange={this.handleInputChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input 
                            type="password" 
                            id="password"
                            name="password"
                            value={password}
                            onChange={this.handleInputChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>User Profile:</label>
                        <div className="dropdown-container" ref={this.dropdownRef}>
                            <button 
                                type="button"
                                className="dropdown-button"
                                onClick={() => this.setState({ dropdownOpen: !dropdownOpen })}
                            >
                                <span>{userProfile || "User Profile"}</span>
                                <span className="dropdown-arrow">▼</span>
                            </button>
                            
                            {dropdownOpen && (
                                <div className="dropdown-menu">
                                    <div 
                                        className="dropdown-item"
                                        onClick={() => this.selectUserProfile('Cleaner')}
                                    >
                                        Cleaner
                                    </div>
                                    <div 
                                        className="dropdown-item"
                                        onClick={() => this.selectUserProfile('Homeowner')}
                                    >
                                        Homeowner
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="button-container">
                        <button type="submit" className="create-button">
                            Create
                        </button>
                    </div>
                </form>

                {response && (
                    <div className="success">
                        <p>User created successfully!</p>
                        <p>Username: {response.username}</p>
                    </div>
                )}

                {error && <div className="error">Error: {error}</div>}
            </div>
        );
    }
}

export default UserAdminUI;