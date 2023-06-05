import React, { useEffect, useState } from 'react'

export default function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  //1. here, we are checking if the value exists yet:
  const [value, setValue] = useState<T>(() => {
    const jsonValue = localStorage.getItem(key);
    if (jsonValue == null) {
        if(typeof initialValue === "function"){
            return (initialValue as () => T)()
        } else {
            return initialValue
        }
    } else {
        return JSON.parse(jsonValue);
    }
  })  

  //2. and then, everytime we change it, just update it
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value, setValue])
  
  return [value, setValue] as [T, typeof setValue]
}
