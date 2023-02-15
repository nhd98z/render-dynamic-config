import Head from 'next/head'
import axios from 'axios'
import { useEffect, useState } from 'react'

function updateObject(object, newValue, path) {
  let stack = path.split('>')
  while (stack.length > 1) {
    object = object[stack.shift()]
  }
  object[stack.shift()] = newValue
}

function A(props) {
  let { data, setData, path } = props || {}
  if (data === undefined) {
    return null
  }
  if (typeof data === 'string' || typeof data === 'number') {
    return (
      <input
        type="text"
        value={data}
        onChange={e => {
          const val = e.currentTarget.value
          setData(prev => {
            if (typeof prev === 'string' || typeof prev === 'number') {
              return val
            }
            updateObject(prev, val, path.substring(1, path.length))
            return { ...prev }
          })
        }}
      />
    )
  }
  if (typeof data === 'boolean') {
    return <input type="checkbox" checked={data} />
  }
  if (Array.isArray(data)) {
    return (
      <div>
        {'['}
        {data.map((item, index) => (
          <div key={index}>
            <A data={item} setData={setData} path={path + '>' + index} />
          </div>
        ))}
        {']'}
      </div>
    )
  }
  return (
    <ul>
      {'{'}
      {Object.keys(data).map((key, index) => (
        <div key={index}>
          {key}
          <A data={data[key]} setData={setData} path={path + '>' + key} />
        </div>
      ))}
      {'}'}
    </ul>
  )
}

export default function Home() {
  const [data, setData] = useState()
  console.log(`data`, data)
  useEffect(() => {
    const fn = async () => {
      const response = await axios.get(
        'https://ks-setting-admin.kyberengineering.io/api/v1/admin/notification/topic-groups',
      )
      setData(response.data.data)
    }
    fn()
  }, [])

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <A data={data} setData={setData} path="" />
    </div>
  )
}
