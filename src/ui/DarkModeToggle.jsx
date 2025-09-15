import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi2'
import ButtonIcon from './ButtonIcon'
import { useDarkMode } from '../context/DarkModeContext'

function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  const handleAction = () => {
    toggleDarkMode()
  }
  return (
    <ButtonIcon onClick={handleAction}>
      {isDarkMode ? <HiOutlineSun /> : <HiOutlineMoon />}
    </ButtonIcon>
  )
}

export default DarkModeToggle
