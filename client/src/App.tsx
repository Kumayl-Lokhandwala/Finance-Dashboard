import { CssBaseline} from "@mui/material"
import { createTheme } from "@mui/material/styles"
import { useEffect, useMemo } from "react"
import { themeSettings } from "./theme"

function App() {
  useEffect(() => {

  },[])
  const theme = useMemo(()=> createTheme(themeSettings), [])
  return (
    <div className='app'>
        <CssBaseline/>
        Checking this branch
    </div>
  )
}

export default App
