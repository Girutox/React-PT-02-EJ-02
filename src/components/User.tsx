import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import UserList from "./UserList"
import { User } from './User.d'
import { Sorting } from "./User.d"

const USER_BASE_URL = 'https://randomuser.me/api/'

const User = () => {
  const [count, setCount] = useState<number>(0);

  const [users, setUsers] = useState<User[]>([]);
  const originalUsers = useRef<User[]>([]);
  const [showColors, setShowColors] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<Sorting>(Sorting.NONE);
  const [filterByCountry, setFilterByCountry] = useState<string>('');

  useEffect(() => {
    fetch(`${USER_BASE_URL}?results=100`)
      .then(response => response.json())
      .then(data => {
        setUsers(data.results)
        originalUsers.current = data.results
      })
  }, [])

  const changeColorHandler = () => {
    setShowColors(!showColors)
  }

  const sortByHandler = useCallback((column: Sorting) => {
    if (sortBy === column) {
      setSortBy(Sorting.NONE)
    } else {
      setSortBy(column)
    }
  }, [sortBy]);

  const deleteUserHandler = useCallback((id: string) => {
    setUsers(users.filter(item => item.login.uuid !== id));
  }, [users]);

  const resetHandler = () => {
    setUsers(originalUsers.current);
  }

  const filterByCountryHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterByCountry(event.target.value);
  }

  const filteredUsers = useMemo(() => {
    console.log('FILTERED EXECUTED!!!');

    return users.filter(item => {
      return item.location.country.toLowerCase().includes(filterByCountry.toLowerCase())
    })
  }, [filterByCountry, users]);

  const sortedUsers = useMemo(() => {
    console.log('SORTED EXECUTED!!!');

    if (sortBy === Sorting.NONE) {
      return filteredUsers
    }

    const variants = {
      [Sorting.NAME]: (user: User) => user.name.first,
      [Sorting.LAST]: (user: User) => user.name.last,
      [Sorting.COUNTRY]: (user: User) => user.location.country,
    }

    return filteredUsers.toSorted((a, b) => {
      const fn = variants[sortBy]
      const valA = fn(a)
      const valB = fn(b)

      return valA > valB ? 1 : -1
    })
  }, [filteredUsers, sortBy]);

  return <>
    <h1>Prueba técnica 02</h1>
    <header style={{ display: "flex", justifyContent: "center", gap: '5px' }}>
      <button onClick={changeColorHandler}>Colorear filas</button>
      <button onClick={() => sortByHandler(Sorting.COUNTRY)}>
        {sortBy === Sorting.COUNTRY ? 'No ordenar por país' : 'Ordenar por país'}
      </button>
      <button onClick={resetHandler}>Resetear estado</button>
      <input type="text" placeholder="Filtra por país" onChange={filterByCountryHandler} />
    </header>
    <main style={{ marginTop: '25px' }}>
      <hr />
      <p>Increment: {count}</p>
      <button onClick={() => setCount(prev => prev + 1)}>+</button>
      <hr />
      <UserList
        data={sortedUsers}
        showColors={showColors}
        onDelete={deleteUserHandler}
        onSort={sortByHandler} />
    </main>
  </>
}

export default User