"use client"
import { persistor, store } from '@/store/store'
import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

export const ReduxProvider = ({children}:{children: React.ReactNode}) => {
  return (
    <Provider store={store}>
        <PersistGate persistor={persistor} loading={null} >
          {children}
        </PersistGate>
    </Provider>
  )
}

