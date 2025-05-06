import { useState, useEffect } from "react"
import styles from "./index.module.scss"

interface MenuProps {
  onChange: (text: string) => void
}

interface MenuItem {
  text: string
  active: boolean
}

const DEFAULT_MENU_LIST: MenuItem[] = [{
  text: "Chat",
  active: true
}, {
  text: "Agent",
  active: false
}]

const Menu = (props: MenuProps) => {
  const { onChange } = props
  const [menuList, setMenuList] = useState(DEFAULT_MENU_LIST)

  // Listen for settings changes to sync UI state
  useEffect(() => {
    const handleSettingsChange = (e: CustomEvent<any>) => {
      const settings = e.detail
      console.log("Menu received settings change:", settings)
    }

    window.addEventListener('astra-settings-changed', handleSettingsChange as EventListener)
    return () => {
      window.removeEventListener('astra-settings-changed', handleSettingsChange as EventListener)
    }
  }, [])

  const onClickItem = (index: number) => {
    if (menuList[index].active) {
      return
    }
    const newMenuList = menuList.map((item, i) => {
      return {
        ...item,
        active: i == index
      }
    })
    setMenuList(newMenuList)
    onChange(menuList[index].text)
  }

  return <div className={styles.menu}>
    {menuList.map((item, index) => {
      return <span
        key={index}
        className={`${styles.menuItem} ${item.active ? styles.active : ''}`}
        onClick={() => onClickItem(index)}>{item.text}</span>
    })}
  </div>
}

export default Menu
