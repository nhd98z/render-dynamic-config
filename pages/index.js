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
  if (data === undefined || data == null) {
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
    return (
      <input
        type="checkbox"
        checked={data}
        onChange={e => {
          setData(prev => {
            if (typeof prev === 'boolean') {
              return !data
            }
            updateObject(prev, !data, path.substring(1, path.length))
            return { ...prev }
          })
        }}
      />
    )
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
  const [data, setData] = useState({})
  console.log(`data`, data)
  useEffect(() => {
    const fn = async () => {
      const response = await axios.get(
        'https://meta-aggregator.dev.kyberengineering.io/polygon/api/v1/routes?tokenIn=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&tokenOut=0xc2132d05d31c914a87c6611c10748aeb04b58e8f&amountIn=10000000000000000&saveGas=0&gasInclude=1&dexes=&slippageTolerance=100&deadline=&to=0x3f499def42cd6De917A2A8da02F71fC9517E650C&chargeFeeBy=&feeReceiver=&isInBps=&feeAmount=&clientData=%7B%22source%22%3A%22kyberswap%22%7D',
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
