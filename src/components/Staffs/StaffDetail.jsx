import React, {useEffect, useState} from "react";
import axios from "../../api/axios";
import defaultAvatar from "../../assets/images/defaultAvatar/defaultAvatar.jpeg"
import StaffPassword from "./StaffPassword";

const tinh_tp = require("../../Models/Address/tinh-tp.json");
const quan_huyen = require("../../Models/Address/quan-huyen.json");
const xa_phuong = require("../../Models/Address/xa-phuong.json");

export default function StaffDetail({visible, onClose, staffData, action, handleAddStaff, handleEditStaff}) {
    const [staff, setStaff] = useState(staffData);

    const [cities, setCities] = useState(tinh_tp);
    const [districts, setDistricts] = useState(quan_huyen);
    const [wards, setWards] = useState(xa_phuong);

    const [isValidEmail, setIsValidEmail] = useState(true);
    const [visibleStaffPassword, setVisibleStaffPassword] = useState(false);

    useEffect(() => { // Set staff data
        if (action === "add") {
            const newStaff = {
                email: "",
                name: "",
                password: "",
                phone: "",
                image: "",
                birthday: new Date().toISOString().split('T')[0],
                gender: "Nam",
                status: "active",
                city: "Tỉnh Lào Cai",
                district: "Thành phố Lào Cai",
                ward: "Phường Duyên Hải",
                address: "",
                role: "staff",
                cityCode: "10",
                districtCode: "080",
            };

            setStaff(newStaff);
        } else if (action === "detail") {

            setStaff((prevStaff) => {
                const newCity = cities.find((tinh) => tinh.name === staffData.city);
                const newDistrict = districts.find((quan) => quan.parent_code === newCity?.code);
                return {
                    ...prevStaff,
                    email: staffData.email,
                    name: staffData.name,
                    password: staffData.password,
                    phone: staffData.phone,
                    image: staffData.image,
                    gender: staffData.gender,
                    status: staffData.status,
                    address: staffData.address,
                    ward: staffData.ward,
                    city: staffData.city,
                    district: staffData.district,
                    role: staffData.role,
                    birthday: staffData.birthday ? staffData.birthday.split('T')[0] : "",
                    cityCode: newCity?.code,
                    districtCode: newDistrict?.code,
                };
            });
        }
    }, [staffData, action]);


    const handleOnChange = (e) => {
        const {id, value} = e.target;

        if (id === "city") {
            const newCity = cities.find((tinh) => tinh.name === value);
            const newDistrict = districts.find((quan) => quan.parent_code === newCity?.code);
            const newWard = wards.find((xa) => xa.parent_code === newDistrict?.code);

            setStaff((prevStaff) => ({
                ...prevStaff,
                city: value,
                cityCode: newCity?.code,
                districtCode: newDistrict?.code,
                district: newDistrict?.name,
                ward: newWard?.name,
            }));
        } else if (id === "district") {
            const newDistrict = districts.find((quan) => quan.name === value);
            const newWard = wards.find((xa) => xa.parent_code === newDistrict?.code);

            setStaff((prevStaff) => ({
                ...prevStaff,
                district: value,
                districtCode: newDistrict?.code,
                ward: newWard?.name,
            }));
        } else {
            setStaff((prevStaff) => ({
                ...prevStaff,
                [id]: value,
            }));
        }
    }

    const handleValidEmail = async (e) => {
        try {
            const res = await axios.get(`User/Staffs/Valid/email=${e.target.value}`);
            setIsValidEmail(true);
        } catch (e) {
            alert("Email đã tồn tại")
            setIsValidEmail(false);
        }
    }

    const handleOnSave = (e) => {
        e.preventDefault();

        if (action === "add") {
            handleAddStaff(staff);
        } else if (action === "detail") {
            handleEditStaff(staff);
        }
    }

    const handleOnOpenStaffPassword = () => {
        setVisibleStaffPassword(true);
    }

    const handleCloseStaffPassword = () => {
        setVisibleStaffPassword(false);
    }

    const handleChangePassword = async (newPassword) => {
        try {
            const response = await axios.put(`User/ChangePassword/${staff.email}`, newPassword);
            if (response.status === 204) {
                alert("Đổi mật khẩu thành công");
                setVisibleStaffPassword(false);
            }
        } catch (e) {
            alert("Đổi mật khẩu thất bại");
        }
    }

    const handleOnDeletePicture = (e) => {
        e.preventDefault();
        setStaff((prevStaff) => ({
            ...prevStaff,
            image: "",
        }));
    }

    if (!visible) return null;


    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm"
        >
            <div className="bg-white p-3 rounded-md">
                <div className="flex justify-between">
                    <div className="text-2xl">Thông tin nhân viên</div>
                    <button onClick={onClose}>X</button>
                </div>
                <div className="grid grid-cols-2 gap-5">
                    <div className="">
                        <label className="" htmlFor="id">
                            Email(*)
                        </label>
                        <input
                            type="text"
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300 ${isValidEmail ? "" : "border-red-500"}`}
                            id="email"
                            onChange={(e) => handleOnChange(e)}
                            onBlur={(e) => handleValidEmail(e)}
                            value={staff.email}
                            disabled={action === "detail"}
                        />
                    </div>
                    <div className="">
                        <label className="" htmlFor="name">
                            Tên(*)
                        </label>
                        <input
                            type="text"
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                            id="name"
                            onChange={(e) => handleOnChange(e)}
                            value={staff.name}
                        />
                    </div>
                    <div className="">
                        <label className="" htmlFor="phone">
                            Số điện thoại(*)
                        </label>
                        <input
                            type="text"
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                            id="phone"
                            onChange={(e) => handleOnChange(e)}
                            value={staff.phone}
                        />
                    </div>
                    <div className="">
                        <label className="" htmlFor="gender">
                            Giới tính(*)
                        </label>
                        <select
                            name={"gender"}
                            id={"gender"}
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                            onChange={(e) => handleOnChange(e)}
                            defaultValue={staff.gender}
                        >
                            <option value={"Nam"}>Nam</option>
                            <option value={"Nữ"}>Nữ</option>
                        </select>
                    </div>
                    <div className="">
                        <label className="" htmlFor="birthday">
                            Ngày sinh
                        </label>
                        <input
                            type="date"
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                            id="birthday"
                            onChange={(e) => handleOnChange(e)}
                            value={staff.birthday}
                        />
                    </div>
                    <div className="">
                        <label className="" htmlFor=" address">
                            Địa chỉ(*)
                        </label>
                        <input
                            type="text"
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                            id="address"
                            onChange={(e) => handleOnChange(e)}
                            value={staff.address}
                        />
                    </div>
                    <div className="">
                        <label className="" htmlFor="status">
                            Tình trạng(*)
                        </label>
                        <select
                            name={"status"}
                            id={"status"}
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                            onChange={(e) => handleOnChange(e)}
                            value={staff.status}
                        >
                            <option value={"active"}>Hoạt động</option>
                            <option value={"inactive"}>Không hoạt động</option>
                        </select>
                    </div>
                    <div className="">
                        <label className="" htmlFor="city">
                            Tỉnh/Thành phố(*)
                        </label>
                        <select
                            name={"city"}
                            id={"city"}
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                            onChange={(e) => handleOnChange(e)}
                            defaultValue={"staffCity"}
                        >
                            <option
                                id={"staffCity"}
                                value={staff.city}
                            >
                                {staff.city}
                            </option>
                            {
                                cities.map((tinh) => (
                                    <option value={tinh.name}
                                            key={tinh.code}
                                    >
                                        {tinh.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="">
                        <label className="m" htmlFor={"district"}>
                            Quận/Huyện(*)
                        </label>
                        <select
                            name={"district"}
                            id={"district"}
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                            onChange={(e) => handleOnChange(e)}
                            defaultValue={"staffDistrict"}
                        >
                            {(staffData.city === staff.city) &&
                                <option
                                    id={"staffDistrict"}
                                    value={staff.district}
                                >
                                    {staff.district}
                                </option>
                            }
                            {
                                districts.map((quan) => (quan.parent_code === staff.cityCode) && (
                                    <option key={quan.code}
                                            value={quan.name}
                                    >
                                        {quan.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="">
                        <label className="" htmlFor="ward">
                            Xã/Phường(*)
                        </label>
                        <select
                            name={"ward"}
                            id={"ward"}
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                            onChange={(e) => handleOnChange(e)}
                            defaultValue={"staffWard"}
                        >
                            {(staffData.district === staff.district && staffData.city === staff.city) &&
                                <option
                                    id={"StaffWard"}
                                    value={staff.ward}
                                >
                                    {staff.ward}
                                </option>}
                            {
                                wards.map((ward) => (
                                    (ward.parent_code === staff.districtCode) &&
                                    <option key={ward.code}
                                            value={ward.name}
                                    >
                                        {ward.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <div className={"col-span-2"}>
                        <label className="" htmlFor="image">
                            Ảnh đại diện
                        </label>
                        <img
                            src={staff.image ? `data:image/jpeg;base64, ${staff.image}` : defaultAvatar}
                            alt="avatar"
                            className="w-24 h-24 rounded-full mx-auto"
                        />
                    </div>
                    <div>
                        {
                            <input
                                type="file"
                                className=""
                                id="image"
                                onChange={(e) => handleOnChange(e)}
                            />
                        }
                    </div>
                    <div className={"flex justify-end"}>
                        <button
                            className="px-2 py-1 ml-2 text-white bg-red-400 rounded-md"
                            onClick={(e) => handleOnDeletePicture(e)}
                        >
                            Xoá ảnh
                        </button>
                    </div>
                    <div>
                        {action === "detail" ? (
                            <button
                                className="px-2 py-1 text-white bg-green-400 rounded-md"
                                onClick={handleOnOpenStaffPassword}
                            >
                                Đổi mật khẩu
                            </button>
                        ) : null}
                    </div>

                    <div className={"flex justify-end"}>
                        <button
                            className="px-2 py-1 text-white bg-blue-500 rounded-md"
                            onClick={(e) => handleOnSave(e)}
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            </div>
            <StaffPassword visible={visibleStaffPassword} onClose={handleCloseStaffPassword}
                           staffEmail={staff.email}
                           handleChangePassword={handleChangePassword}/>
        </div>
    );
}