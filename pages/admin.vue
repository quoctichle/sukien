<template>
  <div class="admin-page">
    <header class="admin-header">
      <div class="header-content">
        <h1>{{ t('adminPanel') }}</h1>
        <div class="user-section">
          <span>{{ t('welcome') }}, {{ currentUser?.name }}</span>
          <button @click="logout" class="logout-btn">{{ t('logout') }}</button>
        </div>
      </div>
    </header>

    <div class="admin-container">
      <aside class="sidebar">
        <nav class="admin-nav">
          <a href="#" class="nav-item active" @click="activeTab = 'users'">
            {{ t('users') }}
          </a>
          <a href="#" class="nav-item" @click="activeTab = 'codes'">
            {{ t('manageCodes') || 'Quản lý mã tham dự' }}
          </a>
          <a href="#" class="nav-item" @click="activeTab = 'customers'">
            Quản lý khách hàng
          </a>
        </nav>
      </aside>

      <main class="admin-content">
        <div v-if="activeTab === 'users'" class="users-section">
          <h2>{{ t('manageUsers') }}</h2>
          
          <div v-if="loading" class="loading">{{ t('loading') }}</div>
          <div v-else-if="users.length > 0" class="users-table">
            <table>
              <thead>
                <tr>
                  <th>{{ t('name') }}</th>
                  <th>{{ t('email') }}</th>
                  <th>{{ t('userRole') }}</th>
                  <th>{{ t('active') }}</th>
                  <th>{{ t('edit') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in users" :key="u._id">
                  <td>{{ u.name }}</td>
                  <td>{{ u.email }}</td>
                  <td>
                    <span :class="['role-badge', u.role]">
                      {{ u.role === 'admin' ? t('admin') : t('users') }}
                    </span>
                  </td>
                  <td>
                    <span :class="['status', u.isActive ? 'active' : 'inactive']">
                      {{ u.isActive ? t('active') : t('inactive') }}
                    </span>
                  </td>
                  <td>
                    <button @click="editUser(u)" class="edit-btn">{{ t('edit') }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="no-users">{{ t('userNotFound') }}</div>
        </div>

        <div v-if="activeTab === 'codes'" class="codes-section">
          <h2>Quản lý mã tham dự</h2>

          <div class="code-actions" style="display:flex;gap:12px;margin-bottom:12px;flex-wrap:wrap">
            <button @click="generateCodes('V')" class="create-btn">Tạo 50 mã Vàng</button>
            <button @click="generateCodes('B')" class="create-btn">Tạo 50 mã Bạc</button>
            <button @click="generateCodes('D')" class="create-btn">Tạo 50 mã Đồng</button>
            <button @click="generateCodes('X')" class="create-btn">Tạo 50 mã bất kỳ</button>
            <button @click="loadCodes" class="create-btn outline">Tải lại</button>
            <button @click="exportCodes" class="create-btn outline">Xuất file</button>
          </div>

          <div v-if="codesLoading" class="loading">Đang tải...</div>

          <div v-else>
            <table class="codes-table">
              <thead>
                <tr><th>Mã</th><th>Loại</th><th>Đã sử dụng</th><th>Ngày tạo</th></tr>
              </thead>
              <tbody>
                <tr v-for="c in codes" :key="c._id">
                  <td>{{ c.code }}</td>
                  <td>{{ c.type === 'X' ? 'Khác' : c.type }}</td>
                  <td>{{ c.used ? 'Có' : 'Chưa' }}</td>
                  <td>{{ new Date(c.createdAt).toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="activeTab === 'customers'" class="customers-section">
          <h2>Quản lý khách hàng</h2>

          <div class="customer-actions" style="margin-bottom:16px">
            <button @click="loadCustomers" class="create-btn outline">Tải lại</button>
            <button @click="exportCustomers" class="create-btn outline">Xuất file</button>
          </div>

          <div v-if="customersLoading" class="loading">Đang tải...</div>

          <div v-else-if="customers.length > 0" class="customers-table">
            <table>
              <thead>
                <tr>
                  <th>Tên Facebook</th>
                  <th>ID khách hàng</th>
                  <th>Mã tham dự</th>
                  <th>Số dự đoán</th>
                  <th>Dự đoán</th>
                  <th>Ngày tham gia</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="customer in customers" :key="customer._id">
                  <td>{{ customer.name }}</td>
                  <td>{{ customer.customerId }}</td>
                  <td><strong>{{ customer.code }}</strong></td>
                  <td class="center">{{ customer.predictionsCount }}</td>
                  <td>{{ customer.predictions.join(', ') }}</td>
                  <td>{{ new Date(customer.createdAt).toLocaleString('vi-VN') }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="no-data">Không có khách hàng nào</div>
        </div>

        <div v-if="editingUser" class="edit-modal">
          <div class="modal-content">
            <h3>{{ t('edit') }} {{ editingUser.name }}</h3>
            <form @submit.prevent="saveUser">
              <div class="form-group">
                <label>{{ t('userRole') }}</label>
                <select v-model="editingUser.role">
                  <option value="user">{{ t('users') }}</option>
                  <option value="admin">{{ t('admin') }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>
                  <input type="checkbox" v-model="editingUser.isActive" />
                  {{ t('active') }}
                </label>
              </div>
              <div class="form-actions">
                <button type="submit" class="save-btn">{{ t('save') }}</button>
                <button type="button" @click="editingUser = null" class="cancel-btn">{{ t('cancel') }}</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin'
})

const router = useRouter()
const { t } = useTranslate()
const token = useCookie('auth_token')

const users = ref<any[]>([])
const loading = ref(true)
const activeTab = ref('users')
const editingUser = ref<any>(null)
const currentUser = ref<any>(null)

onMounted(async () => {
  try {
    // Check auth
    const authResponse = await $fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    currentUser.value = authResponse.user

    // Fetch users
    const usersResponse = await $fetch('/api/admin/users', {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    users.value = usersResponse.users
    loading.value = false
  } catch (error) {
    console.error('Failed to fetch data:', error)
    await router.push('/login')
  }
})

watch(activeTab, (v) => {
  if (v === 'codes') loadCodes()
  if (v === 'customers') loadCustomers()
})

const editUser = (user: any) => {
  editingUser.value = { ...user }
}

const saveUser = async () => {
  try {
    await $fetch('/api/admin/update-user', {
      method: 'POST',
      body: {
        userId: editingUser.value._id,
        role: editingUser.value.role,
        isActive: editingUser.value.isActive
      },
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    
    // Update user in list
    const index = users.value.findIndex(u => u._id === editingUser.value._id)
    if (index !== -1) {
      users.value[index] = editingUser.value
    }
    editingUser.value = null
  } catch (error) {
    console.error('Failed to update user:', error)
  }
}

const logout = () => {
  token.value = null
  router.push('/login')
}

// Codes management
const codes = ref<any[]>([])
const codesLoading = ref(false)

const loadCodes = async () => {
  codesLoading.value = true
  try {
    const res = await $fetch('/api/admin/codes', {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    codes.value = res.codes || []
  } catch (e) {
    console.error('Failed to load codes', e)
  } finally {
    codesLoading.value = false
  }
}

const generateCodes = async (category: string) => {
  if (!confirm(`Tạo 50 mã cho loại ${category}?`)) return
  try {
    const res = await $fetch('/api/admin/generate-codes', {
      method: 'POST',
      body: { category, count: 50 },
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (res && res.created) {
      // Prepend created codes to list
      const newItems = res.created.map((c: string) => ({ code: c, type: category === 'X' ? 'X' : category, used: false, createdAt: new Date().toISOString() }))
      codes.value = [...newItems, ...codes.value]
      alert(`Tạo thành công ${res.created.length} mã`)
    }
  } catch (e) {
    console.error('Failed to generate codes', e)
    alert('Tạo mã thất bại')
  }
}

const exportCodes = () => {
  try {
    if (!codes.value || codes.value.length === 0) {
      alert('Không có mã để xuất')
      return
    }

    // Prepare CSV headers
    const headers = ['Mã','Loại','Đã sử dụng','Ngày tạo']
    const rows = codes.value.map((c: any) => [
      c.code,
      c.type === 'X' ? 'Khác' : c.type,
      c.used ? 'Có' : 'Chưa',
      new Date(c.createdAt).toLocaleString()
    ])

    const all = [headers, ...rows]
    const csvContent = all.map(r => r.map(field => `"${String(field).replace(/"/g,'""')}"`).join(',')).join('\r\n')

    // Add BOM for Excel compatibility
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const now = new Date()
    const fname = `codes-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}.csv`
    a.href = url
    a.setAttribute('download', fname)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (e) {
    console.error('Export failed', e)
    alert('Xuất file thất bại')
  }
}

// Customers management
const customers = ref<any[]>([])
const customersLoading = ref(false)

const loadCustomers = async () => {
  customersLoading.value = true
  try {
    const res = await $fetch('/api/admin/customers', {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    customers.value = res.data || []
  } catch (e) {
    console.error('Failed to load customers', e)
    alert('Tải khách hàng thất bại')
  } finally {
    customersLoading.value = false
  }
}

const exportCustomers = () => {
  try {
    if (!customers.value || customers.value.length === 0) {
      alert('Không có khách hàng để xuất')
      return
    }

    const headers = ['Tên Facebook', 'ID khách hàng', 'Mã tham dự', 'Số dự đoán', 'Dự đoán', 'Ngày tham gia']
    const rows = customers.value.map((c: any) => [
      c.name,
      c.customerId,
      c.code,
      c.predictionsCount,
      c.predictions.join('; '),
      new Date(c.createdAt).toLocaleString('vi-VN')
    ])

    const all = [headers, ...rows]
    const csvContent = all.map(r => r.map(field => `"${String(field).replace(/"/g,'""')}"`).join(',')).join('\r\n')

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const now = new Date()
    const fname = `customers-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}.csv`
    a.href = url
    a.setAttribute('download', fname)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (e) {
    console.error('Export failed', e)
    alert('Xuất file thất bại')
  }
}
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.admin-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-header h1 {
  margin: 0;
  font-size: 32px;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.admin-container {
  display: flex;
  max-width: 1400px;
  margin: 20px auto;
  gap: 20px;
  padding: 0 20px;
}

.sidebar {
  width: 250px;
}

.admin-nav {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-item {
  display: block;
  padding: 15px 20px;
  color: #333;
  text-decoration: none;
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
}

.nav-item:hover, .nav-item.active {
  background: #f5f7fa;
  border-left-color: #667eea;
  color: #667eea;
}

.admin-content {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.users-section h2 {
  color: #667eea;
  margin-top: 0;
  margin-bottom: 20px;
}

.users-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f5f7fa;
}

th {
  padding: 12px;
  text-align: left;
  color: #667eea;
  font-weight: bold;
  border-bottom: 2px solid #e1e8ed;
}

td {
  padding: 12px;
  border-bottom: 1px solid #e1e8ed;
}

tr:hover {
  background: #f9fafb;
}

.role-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.role-badge.admin {
  background: #ffebee;
  color: #c62828;
}

.role-badge.user {
  background: #e3f2fd;
  color: #1565c0;
}

.status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.status.active {
  background: #e8f5e9;
  color: #2e7d32;
}

.status.inactive {
  background: #ffe0b2;
  color: #e65100;
}

.edit-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: #764ba2;
}

.edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  min-width: 400px;
}

.modal-content h3 {
  color: #667eea;
  margin-top: 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: bold;
}

.form-group select,
.form-group input[type="checkbox"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group input[type="checkbox"] {
  width: auto;
  margin-right: 8px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.save-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn:hover {
  background: #764ba2;
}

.cancel-btn {
  background: #ddd;
  color: #333;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #ccc;
}

.loading, .no-users {
  text-align: center;
  color: #667eea;
  padding: 40px;
  font-weight: bold;
}

.codes-section .create-btn{background:#667eea;color:white;border:none;padding:10px 14px;border-radius:6px;cursor:pointer}
.codes-section .create-btn.outline{background:transparent;color:#667eea;border:1px solid #667eea}
.codes-table{width:100%;border-collapse:collapse;background:white;border-radius:8px;overflow:hidden}
.codes-table th{background:#f5f7fa;padding:10px;text-align:left;color:#667eea}
.codes-table td{padding:10px;border-top:1px solid #eee}

.customers-section .customer-actions button {background:#667eea;color:white;border:none;padding:10px 14px;border-radius:6px;cursor:pointer;margin-right:8px}
.customers-section .customer-actions button.outline {background:transparent;color:#667eea;border:1px solid #667eea}
.customers-table{width:100%;border-collapse:collapse;background:white;border-radius:8px;overflow:hidden}
.customers-table th{background:#f5f7fa;padding:10px;text-align:left;color:#667eea;font-weight:bold}
.customers-table td{padding:10px;border-top:1px solid #eee}
.customers-table td.center{text-align:center}
.no-data{text-align:center;padding:40px;color:#999;font-weight:bold}
</style>
