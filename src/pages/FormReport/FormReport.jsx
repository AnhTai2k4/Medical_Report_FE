import { useEffect, useState } from "react";
import "./FormReport.css";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";



const FormReport = () => {
  const [formData, setFormData] = useState({
    reportType: "", // Hinh thuc bao cao su co
    reportNumber: "", //So bao cao/ Ma so su co
    reportDate: "", // Ngay bao cao
    reportUnit: "", // Đơn vị báo cáo

    patientName: "", // Họ tên người bệnh
    patientNumber: "", //Số bệnh án
    patientDateOfBirth: "", // Ngày sinh
    patientGender: "", // Giới tính
    patientDepartment: "", // Khoa người bệnh

    incidentLocation: "", //Nơi xảy ra sự cố
    incidentDate: "", // Ngày xảy ra sự cố

    incidentObject: [], // Đối tượng xảy ra sự cố
    incidentHappened: "", // Vị trí cụ thể
    incidentTime: "", //Thời gian
    patientMedicalRecord: "", //Ghi nhận vào hồ sơ bệnh án
    notifyPatient: "", // Thông báo cho người bệnh

    incidentDescription: "", // Mô tả ngắn gọn về sự cố
    treatmentDescription: "", // Đề xuất giải pháp
    initialTreatment: "", //Điều trị/xử lí ban đầu
    notifyDoctor: "", //Thông báo cho bác sĩ
    notifyFamily: "", //Thông báo cho bác sĩ
    incidentClassification: "", // Phân loại sự cố
    incidentEffect: "", //Đánh giá ban đầu về mức độ ảnh hưởng của sự cố

    reportName: "", //Thông tin người báo cáo
    reportCall: "", // Số điện thoại người báo cáo
    reportEmail: "", // Email người báo cáo
    reportObject: "", //Đối tượng báo cáo

    viewer1: "", //Người chứng kiến 1
    viewer2: "", //Người chứng kiến 2
  });

  const [excelData, setExcelData] = useState([]);

  useEffect(() => {
    const fetchExcel = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BE_URL}/form/getExcel`);
        console.log("Lấy dữ liệu thành công: ");
        setExcelData(res.data.data);
      } catch (e) {
        console.log("Lấy dữ liệu từ file Excel lỗi: ", e);
      }
    };

    fetchExcel();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Nếu là checkbox nhiều lựa chọn
    if (name === "incidentObject") {
      const prev = Array.isArray(formData.incidentObject)
        ? formData.incidentObject
        : [];

      let updated;
      if (checked) {
        // Nếu được tick thì thêm vào mảng
        updated = [...prev, value];
      } else {
        // Nếu bỏ tick thì loại khỏi mảng
        updated = prev.filter((item) => item !== value);
      }

      setFormData({
        ...formData,
        incidentObject: updated,
      });
      console.log("incidentObject:", updated);
    } else {
      // Xử lý input bình thường
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  useEffect(() => {
    console.log(formData.incidentObject);
  }, [formData.incidentObject]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch(`${import.meta.env.VITE_BE_URL}/form/createForm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Có lỗi khi gửi form");
      }

      return res.json(); // trả về dữ liệu JSON từ server
    },
    onSuccess: (data) => {
      console.log("✅ Thành công:", data);
      alert("Tạo thành công!");
    },
    onError: (error) => {
      console.error("❌ Lỗi:", error);
      alert("Vui lòng điền đủ thông tin");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault(); // chặn reload trang

    mutation.mutate(formData);
  };

  useEffect(() => {
    console.log("isPending:", mutation.isPending);
    console.log("isSuccess:", mutation.isSuccess);
    console.log("isError:", mutation.isError);
    console.log("data:", mutation.data);
    console.log("error:", mutation.error);
  }, [mutation.status, mutation.data, mutation.error]);

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>PHỤ LỤC III </h1>
        <h1>MẪU BÁO CÁO SỰ CỐ Y KHOA</h1>
        <p className="subtitle">
          Ban hành kèm theo Thông tư số 43/2018/TT-BYT ngày 26/12/2018 của Bộ
          trưởng Bộ Y tế
        </p>
      </div>

      <form onSubmit={handleSubmit} className="medical-report-form">
        <div className="form-section header-section">
          <div className="header-left">
            <h3>HÌNH THỨC BÁO CÁO SỰ CỐ Y KHOA</h3>
            <div className="checkbox-group">
              <label>
                <input
                  type="radio"
                  name="reportType"
                  defaultValue="Tự nguyện"
                  onChange={handleInputChange}
                />
                Tự nguyện
              </label>
              <label>
                <input
                  type="radio"
                  name="reportType"
                  defaultValue="Bắt buộc"
                  onChange={handleInputChange}
                />
                Bắt buộc
              </label>
            </div>
          </div>

          <div className="header-right">
            <div className="input-group">
              <label>Số báo cáo/Mã số sự cố:</label>
              <input
                type="text"
                name="reportNumber"
                defaultValue={formData.reportNumber}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-group">
              <label>Ngày báo cáo:</label>
              <input
                type="date"
                name="reportDate"
                defaultValue={formData.reportDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-group">
              <label>Đơn vị báo cáo:</label>
              <input
                type="text"
                name="reportUnit"
                defaultValue={formData.reportUnit}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Patient Information*/}
        <div className="form-content">
          <div className="form-column left-column">
            <div className="form-section">
              <h3>Thông tin người bệnh</h3>
              <div className="input-group">
                <label>Họ và tên:</label>
                <input
                  type="text"
                  name="patientName"
                  defaultValue={formData.patientName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Số bệnh án:</label>
                <input
                  type="text"
                  name="patientNumber"
                  defaultValue={formData.patientNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Ngày sinh:</label>
                <input
                  type="date"
                  name="patientDateOfBirth"
                  defaultValue={formData.patientDateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Giới tính:</label>
                <input
                  type="text"
                  name="patientGender"
                  defaultValue={formData.patientGender}
                  onChange={handleInputChange}
                />
              </div>

              <p style={{ color: "#34495e", fontSize: "14px" }}>
                Khoa của người bệnh
              </p>

              <div className="checkbox-group checkbox-group-excel">
                {excelData.map((data) =>
                  data.length == 2 ? (
                    <label>
                      <input
                        type="radio"
                        name="patientDepartment"
                        defaultValue=""
                        onChange={handleInputChange}
                      />
                      {data[1]}
                    </label>
                  ) : null
                )}
              </div>
            </div>

            {/* Incident Location */}
            <div className="form-section">
              <h3>Nơi xảy ra sự cố</h3>
              <div className="input-group">
                <label>
                  Khoa/phòng/vị trí xảy ra sự cố (ví dụ: khoa ICU, khuôn viên
                  bệnh viện):
                </label>
                <input
                  type="text"
                  name="incidentLocation"
                  defaultValue={formData.incidentLocation}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Ngày xảy ra sự cố:</label>
                <input
                  type="date"
                  name="incidentDate"
                  defaultValue={formData.incidentDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Incident Description */}
          </div>

          {/* Right Column */}
          <div className="form-column right-column">
            {/* Incident Subject */}
            <div className="form-section">
              <h3>Đối tượng xảy ra sự cố</h3>
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="incidentObject"
                    defaultValue="Người bệnh"
                    onChange={handleInputChange}
                  />
                  Người bệnh
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="incidentObject"
                    defaultValue="Người nhà/khách đến thăm"
                    onChange={handleInputChange}
                  />
                  Người nhà/khách đến thăm
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="incidentObject"
                    defaultValue="Nhân viên y tế"
                    onChange={handleInputChange}
                  />
                  Nhân viên y tế
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="incidentObject"
                    defaultValue="Trang thiết bị/cơ sở hạ tầng"
                    onChange={handleInputChange}
                  />
                  Trang thiết bị/cơ sở hạ tầng
                </label>
              </div>
            </div>

            {/* Specific Location */}
            <div className="form-section">
              <h3>Vị trí cụ thể (ví dụ: nhà vệ sinh, bãi đậu xe....)</h3>
              <div className="input-group">
                <input
                  type="text"
                  name="incidentHappened"
                  defaultValue={formData.incidentHappened}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Thời gian:</label>
                <input
                  type="time"
                  name="incidentTime"
                  defaultValue={formData.incidentTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Record in File */}
            <div className="form-section">
              <h3>Ghi nhận vào hồ sơ bệnh án/giấy tờ liên quan</h3>
              <div className="checkbox-group">
                <label>
                  <input
                    type="radio"
                    name="patientMedicalRecord"
                    defaultValue="Có"
                    onChange={handleInputChange}
                  />
                  Có
                </label>
                <label>
                  <input
                    type="radio"
                    name="patientMedicalRecord"
                    defaultValue="Không"
                    onChange={handleInputChange}
                  />
                  Không
                </label>
                <label>
                  <input
                    type="radio"
                    name="patientMedicalRecord"
                    defaultValue="Không ghi nhận"
                    onChange={handleInputChange}
                  />
                  Không ghi nhận
                </label>
              </div>
            </div>

            {/* Notify Patient */}
            <div className="form-section">
              <h3>Thông báo cho người bệnh</h3>
              <div className="checkbox-group">
                <label>
                  <input
                    type="radio"
                    name="notifyPatient"
                    defaultValue="Có"
                    onChange={handleInputChange}
                  />
                  Có
                </label>
                <label>
                  <input
                    type="radio"
                    name="notifyPatient"
                    defaultValue="Không"
                    onChange={handleInputChange}
                  />
                  Không
                </label>
                <label>
                  <input
                    type="radio"
                    name="notifyPatient"
                    defaultValue="Không ghi nhận"
                    onChange={handleInputChange}
                  />
                  Không ghi nhận
                </label>
              </div>
            </div>
          </div>
        </div>
        {/* Incident description*/}
        <div className="form-section">
          <h3>Mô tả ngắn gọn về sự cố</h3>
          <textarea
            name="incidentDescription"
            onChange={handleInputChange}
            defaultValue={formData.incidentDescription}
            rows="4"
          />
        </div>

        {/* Initial Solution */}
        <div className="form-section">
          <h3>Đề xuất giải pháp ban đầu</h3>
          <textarea
            name="treatmentDescription"
            onChange={handleInputChange}
            defaultValue={formData.treatmentDescription}
            rows="4"
          />
        </div>

        {/* Initial Treatment */}
        <div className="form-section">
          <h3>Điều trị/xử lí ban đầu đã được thực hiện</h3>
          <textarea
            name="initialTreatment"
            onChange={handleInputChange}
            defaultValue={formData.initialTreatment}
            rows="4"
          />
        </div>

        {/* Doctor Notifications */}
        <div className="form-section">
          <h3>Thông báo cho Bác sĩ điều trị/người có trách nhiệm</h3>
          <div className="checkbox-group">
            <label>
              <input
                type="radio"
                name="notifyDoctor"
                defaultValue="Có"
                onChange={handleInputChange}
              />
              Có
            </label>
            <label>
              <input
                type="radio"
                name="notifyDoctor"
                defaultValue="Không"
                onChange={handleInputChange}
              />
              Không
            </label>
            <label>
              <input
                type="radio"
                defaultValue="Không ghi nhận"
                onChange={handleInputChange}
              />
              Không ghi nhận
            </label>
          </div>
        </div>

        {/* Family Notifications */}
        <div className="form-section">
          <h3>Thông báo cho người nhà/người bảo hộ</h3>
          <div className="checkbox-group">
            <label>
              <input
                type="radio"
                name="notifyFamily"
                defaultValue="Có"
                onChange={handleInputChange}
              />
              Có
            </label>
            <label>
              <input
                type="radio"
                name="notifyFamily"
                defaultValue="Không"
                onChange={handleInputChange}
              />
              Không
            </label>
            <label>
              <input
                type="radio"
                name="notifyFamily"
                defaultValue="Không ghi nhận"
                onChange={handleInputChange}
              />
              Không ghi nhận
            </label>
          </div>
        </div>

        {/* Classification */}
        <div className="form-section">
          <h3>Phân loại ban đầu về sự cố</h3>
          <div className="checkbox-group">
            <label>
              <input
                type="radio"
                name="incidentClassification"
                defaultValue="Chưa xảy ra"
                onChange={handleInputChange}
              />
              Chưa xảy ra
            </label>
            <label>
              <input
                type="radio"
                name="incidentClassification"
                defaultValue="Đã xảy ra"
                onChange={handleInputChange}
              />
              Đã xảy ra
            </label>
          </div>
        </div>
        {/* incident effect*/}
        <div className="form-section">
          <h3>Đánh giá ban đầu về mức độ ảnh hưởng của sự cố</h3>
          <div className="checkbox-group">
            <label>
              <input
                type="radio"
                name="incidentEffect"
                defaultValue="Nặng"
                onChange={handleInputChange}
              />
              Nặng
            </label>
            <label>
              <input
                type="radio"
                name="incidentEffect"
                defaultValue="Trung bình"
                onChange={handleInputChange}
              />
              Trung bình
            </label>
            <label>
              <input
                type="radio"
                name="incidentEffect"
                defaultValue="Trung bình"
                onChange={handleInputChange}
              />
              Nhẹ
            </label>
          </div>
        </div>

        {/* Reporter Information*/}
        <div className="form-section">
          <h3>Thông tin người báo cáo</h3>

          <div className="input-group">
            <label>Họ tên: </label>
            <input
              style={{ width: "50%" }}
              type="text"
              name="reportName"
              value={formData.reportName}
              onChange={handleInputChange}
            />
          </div>

          <div className="input-group">
            <label>Số điện thoại: </label>
            <input
              style={{ width: "50%" }}
              type="text"
              name="reportCall"
              defaultValue=""
              onChange={handleInputChange}
            />
          </div>

          <div className="input-group">
            <label>Email: </label>
            <input
              style={{ width: "50%" }}
              type="text"
              name="reportEmail"
              defaultValue={formData.reportEmail}
              onChange={handleInputChange}
            />
          </div>
          <br />

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="reportObject"
                defaultValue="Người bệnh"
                onChange={handleInputChange}
              />
              Người bệnh
            </label>
            <label>
              <input
                type="checkbox"
                name="reportObject"
                defaultValue="Điều dưỡng(chức danh)"
                onChange={handleInputChange}
              />
              Người nhà/khách đến thăm
            </label>
            <label>
              <input
                type="checkbox"
                name="reportObject"
                defaultValue="Người bệnh"
                onChange={handleInputChange}
              />
              Nhân viên y tế
            </label>
            <label>
              <input
                type="checkbox"
                name="reportObject"
                defaultValue="Người nhà/khách đến thăm"
                onChange={handleInputChange}
              />
              Trang thiết bị/cơ sở hạ tầng
            </label>
            <label>
              <input
                type="checkbox"
                name="reportObject"
                defaultValue="Bác sĩ (chức danh)"
                onChange={handleInputChange}
              />
              Trang thiết bị/cơ sở hạ tầng
            </label>
            <label>
              <input
                type="checkbox"
                name="reportObject"
                defaultValue="Khác"
                onChange={handleInputChange}
              />
              Trang thiết bị/cơ sở hạ tầng
            </label>
          </div>
        </div>

        {/* Viewer Information*/}
        <div className="form-section header-section">
          <div className="header-left">
            <div className="input-group">
              <label>Người chứng kiến 1: </label>
              <input
                type="text"
                name="viewer1"
                defaultValue={formData.viewer1}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="header-right">
            <div className="input-group">
              <label>Người chứng kiến 2: </label>
              <input
                type="text"
                name="viewer2"
                defaultValue={formData.viewer2}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-footer">
          <button type="submit" className="submit-btn">
            Gửi báo cáo
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormReport;
