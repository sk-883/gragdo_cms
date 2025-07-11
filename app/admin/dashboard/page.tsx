import { Suspense } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { AdminStatsCards } from "@/components/admin/dashboard/admin-stats-cards"
import { DailyRevenueReport } from "@/components/admin/dashboard/daily-revenue-report"
import { DoctorsList } from "@/components/admin/dashboard/doctors-list"
import { StaffList } from "@/components/admin/dashboard/staff-list"
import { TransactionHistory } from "@/components/admin/dashboard/transaction-history"
import { AdminAppointments } from "@/components/admin/dashboard/admin-appointments"
import { getAdminDashboardStats, getAdminDoctors, getAdminStaff, getAdminTransactions, getAdminAppointments } from "@/lib/actions/admin-dashboard"

export default async function AdminDashboardPage() {
  const [stats, doctors, staff, transactions, appointments] = await Promise.all([
    getAdminDashboardStats(),
    getAdminDoctors(),
    getAdminStaff(),
    getAdminTransactions(),
    getAdminAppointments()
  ])

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="ADMIN" />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          {/* Stats Cards */}
          <Suspense fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 animate-pulse rounded-[16px]" />
              ))}
            </div>
          }>
            <AdminStatsCards stats={stats} />
          </Suspense>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Daily Revenue Report */}
            <div className="lg:col-span-1">
              <Suspense fallback={
                <div className="bg-white rounded-[20px] shadow-sm p-6">
                  <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
                </div>
              }>
                <DailyRevenueReport />
              </Suspense>
            </div>

            {/* Doctors List */}
            <div className="lg:col-span-1">
              <Suspense fallback={
                <div className="bg-white rounded-[20px] shadow-sm p-6">
                  <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
                </div>
              }>
                <DoctorsList doctors={doctors} />
              </Suspense>
            </div>

            {/* Staff List */}
            <div className="lg:col-span-1">
              <Suspense fallback={
                <div className="bg-white rounded-[20px] shadow-sm p-6">
                  <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
                </div>
              }>
                <StaffList staff={staff} />
              </Suspense>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Transaction History */}
            <div className="xl:col-span-1">
              <Suspense fallback={
                <div className="bg-white rounded-[20px] shadow-sm p-6">
                  <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
                </div>
              }>
                <TransactionHistory transactions={transactions} />
              </Suspense>
            </div>

            {/* Appointments */}
            <div className="xl:col-span-1">
              <Suspense fallback={
                <div className="bg-white rounded-[20px] shadow-sm p-6">
                  <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
                </div>
              }>
                <AdminAppointments appointments={appointments} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}