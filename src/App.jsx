import { Routes, Route } from 'react-router-dom'
import routes from './routes/index.js'


function App() {
  return (
    <>
      <Routes>
        {routes.map((route, index) => {
          const Page = route.page; // Chuyển page thành Component
          return (
            <Route
              key={index}
              path={route.path}
              element={
                                
                  <route.page />
               
              }
            />
          )
        })}
      </Routes>
    </>
  )
}

export default App
