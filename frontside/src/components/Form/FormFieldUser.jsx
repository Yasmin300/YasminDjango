import React from "react";

export default function UserFormFields({
    form,
    errors,
    handleChange,
    includeEmailAndPassword = false
}) {
    return (
        <div className="row">
            {/* Username */}
            <div className="col-md-6 mb-3">
                <label className="form-label">שם משתמש:</label>
                <input
                    type="text"
                    name="username"
                    className="form-control"
                    value={form.username}
                    onChange={handleChange}
                />
                {errors.username && <span>{errors.username}</span>}
            </div>

            {/* First name */}
            <div className="col-md-6 mb-3">
                <label className="form-label">שם פרטי:</label>
                <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    value={form.firstName}
                    onChange={handleChange}
                />
                {errors.firstName && <span>{errors.firstName}</span>}
            </div>

            {/* Middle name */}
            <div className="col-md-6 mb-3">
                <label className="form-label">שם אמצעי:</label>
                <input
                    type="text"
                    name="middleName"
                    className="form-control"
                    value={form.middleName}
                    onChange={handleChange}
                />
                {errors.middleName && <span>{errors.middleName}</span>}
            </div>

            {/* Last name */}
            <div className="col-md-6 mb-3">
                <label className="form-label">שם משפחה:</label>
                <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    value={form.lastName}
                    onChange={handleChange}
                />
                {errors.lastName && <span>{errors.lastName}</span>}
            </div>

            {/* Phone */}
            <div className="col-md-6 mb-3">
                <label className="form-label">טלפון:</label>
                <input
                    type="text"
                    name="phone"
                    className="form-control"
                    value={form.phone}
                    onChange={handleChange}
                />
                {errors.phone && <span>{errors.phone}</span>}
            </div>

            {/* Email + Password */}
            {includeEmailAndPassword && (
                <>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">דוא"ל:</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={form.email}
                            onChange={handleChange}
                        />
                        {errors.email && <span>{errors.email}</span>}
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">סיסמה:</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={form.password}
                            onChange={handleChange}
                        />
                        {errors.password && <span>{errors.password}</span>}
                    </div>
                </>
            )}

            {/* Country */}
            <div className="col-md-6 mb-3">
                <label className="form-label">מדינה:</label>
                <input
                    type="text"
                    name="country"
                    className="form-control"
                    value={form.country}
                    onChange={handleChange}
                />
                {errors.country && <span>{errors.country}</span>}
            </div>

            {/* City */}
            <div className="col-md-6 mb-3">
                <label className="form-label">עיר:</label>
                <input
                    type="text"
                    name="city"
                    className="form-control"
                    value={form.city}
                    onChange={handleChange}
                />
                {errors.city && <span>{errors.city}</span>}
            </div>

            {/* Street */}
            <div className="col-md-6 mb-3">
                <label className="form-label">רחוב:</label>
                <input
                    type="text"
                    name="street"
                    className="form-control"
                    value={form.street}
                    onChange={handleChange}
                />
                {errors.street && <span>{errors.street}</span>}
            </div>

            {/* House number */}
            <div className="col-md-6 mb-3">
                <label className="form-label">מספר בית:</label>
                <input
                    type="text"
                    name="houseNumber"
                    className="form-control"
                    value={form.houseNumber}
                    onChange={handleChange}
                />
                {errors.houseNumber && <span>{errors.houseNumber}</span>}
            </div>
        </div>
    );
}
