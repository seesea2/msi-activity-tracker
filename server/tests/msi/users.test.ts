import { AllUsers, ChangePwd, DeleteUser, InsertUser, LoginUser, LogoutUser } from '../../src/msi/users'

test('to logon', () => {
    const logon = LoginUser({ id: 'test', pwd: 'test' })
    expect(logon.id).toBe('test')
})

test('to logout', () => {
    const logout = LogoutUser({ id: 'test' })
    expect(logout).toBe(true)
})

test('to InsertUser', () => {
    const insert = InsertUser({ id: 'jest', pwd: 'jest' })
    expect(insert.msg).toBe('Done')
})
test('to ChangePwd', () => {
    const change = ChangePwd({ id: 'jest', oldPwd: 'jest', newPwd: 'jest_new' })
    console.log("change", change)
    expect(change.msg).toBe('Done')
})
test('to DeleteUser', () => {
    const del = DeleteUser('jest')
    expect(del).toBe(true)
})
test('to get AllUsers', () => {
    const users = AllUsers()
    expect(users && users.length > 0).toBe(true)
})