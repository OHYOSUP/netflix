import React from 'react'
import { useLocation } from 'react-router-dom'

function Search() {
  // 현재 페이지의 데이터를 가져올 수 있음
const location = useLocation()
// URLSearchParams() = get()과 함께 사용하면url내의 데이터에 접근할 수 있다
const keyword =  new URLSearchParams(location.search).get("keyword");
console.log(keyword);
// => "keyword"

 

  return (
    <div>Search</div>
  )
}

export default Search