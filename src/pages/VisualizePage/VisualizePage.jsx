import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  incidentObjectCounts,
  incidentDateCounts,
  locationDataCounts,
} from "../../services/index.js";
import "./VisualizePage.css";


const VisualizePage = () => {
  const [objectData, setObjectData] = useState([]);
  const [incidentDate, setIncidentDate] = useState([]);
  const [locationData, setLocationData] = useState([]);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#ff2841ff",
    "#161615ff",
    "#c838d2ff",
  ];

  useEffect(() => {
    async function fetchObjectData() {
      const newData = await incidentObjectCounts();
      setObjectData(newData);
    }
    fetchObjectData();
  }, []);

  useEffect(() => {
    async function fetchIncidentDateData() {
      const newData = await incidentDateCounts();
      setIncidentDate(newData);
      console.log("newData", newData);
      setIncidentDate(newData);
    }
    fetchIncidentDateData();
  }, []);

  useEffect(() => {
    async function fetchLocationData() {
      const newData = await locationDataCounts();
      setLocationData(newData);
    }
    fetchLocationData();
  }, []);

  

  return (
    <div style={{ width: "100vh", margin: "0 auto", padding: "20px" }}>
      <h1 style={{color:"black", textAlign: "center"}} >Thống kê số liệu mẫu báo cáo sự cố y khoa </h1>
      {/* Chart 1 */}
      <div className="chart__container">
        <p className="chart__title">Số lượng đối tượng xảy ra sự cố</p>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={objectData}
            margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="value" label={{}} />
            <YAxis
              label={{
                value: "Số tai nạn",
                angle: -90,
                position: "insideLeft",
                offset: 10,
              }}
            />
            <Tooltip />
            <Legend /> {/* 👈 chuyển Legend xuống dưới */}
            <Line
              type="monotone"
              dataKey="cnt"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={{ r: 4, stroke: "#4f46e5", strokeWidth: 2 }}
              name="Số vụ tai nạn"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 2 */}
      <div className="chart__container">
        <p className="chart__title">Thống kê số vụ tai nạn theo tháng</p>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={incidentDate}
            margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              label={{ value: "Tháng", position: "insideRight", offset: 0 }}
            />
            <YAxis
              domain={[0, (dataMax) => dataMax + 2]}
              label={{
                value: "Số tai nạn",
                angle: -90,
                position: "insideLeft",
                offset: 10,
              }}
            />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="cnt"
              name="Số vụ tai nạn"
              fill="#60a5fa"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart__container">
        <p className="chart__title">Số lượng sự cố theo vị trí</p>
        <ResponsiveContainer width="100%" height={500}>
          <PieChart>
            <Pie
              data={locationData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={200}
              fill="#8884d8"
              dataKey="cnt" // 👈 dùng số lượng
              nameKey="value" // 👈 tên vị trí
            >
              {Array.isArray(locationData) &&
                locationData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VisualizePage;
