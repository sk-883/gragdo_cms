"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, PenSquare, Trash2, MoreHorizontal, Eye } from "lucide-react"
import { PatientForm } from "@/components/patients/patient-form"
import { deletePatient } from "@/lib/actions/patients"

interface Patient {
  id: string
  patientId: string
  name: string
  email?: string
  phone: string
  gender: string
  age: number
  address?: string
  medicalHistory?: string
  allergies?: string
  createdAt: Date
}

interface AdminPatientsClientProps {
  initialPatients: Patient[]
}

export function AdminPatientsClient({ initialPatients }: AdminPatientsClientProps) {
  const [patients, setPatients] = useState(initialPatients)
  const [filteredPatients, setFilteredPatients] = useState(initialPatients)
  const [searchTerm, setSearchTerm] = useState("")
  const [recordsPerPage, setRecordsPerPage] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<string | null>(null)

  useEffect(() => {
    const filtered = patients.filter((patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.includes(searchTerm) ||
      patient.phone.includes(searchTerm) ||
      patient.gender.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPatients(filtered)
    setCurrentPage(1)
  }, [searchTerm, patients])

  const handleSubmit = async (data: any) => {
    console.log("Patient data:", data)
    setIsFormOpen(false)
    setEditingPatient(null)
  }

  const handleEdit = (id: string) => {
    setEditingPatient(id)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    const result = await deletePatient(id)
    if (result.success) {
      setPatients(prev => prev.filter(p => p.id !== id))
    } else {
      console.error('Failed to delete patient:', result.error)
    }
  }

  const handleView = (id: string) => {
    console.log('View patient:', id)
  }

  // Pagination logic
  const totalRecords = filteredPatients.length
  const recordsPerPageNum = parseInt(recordsPerPage)
  const totalPages = Math.ceil(totalRecords / recordsPerPageNum)
  const startIndex = (currentPage - 1) * recordsPerPageNum
  const endIndex = startIndex + recordsPerPageNum
  const paginatedPatients = filteredPatients.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRecordsPerPageChange = (value: string) => {
    setRecordsPerPage(value)
    setCurrentPage(1)
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-sf-pro font-bold text-[#7165e1]">
          Patients Management
        </h1>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button variant="digigo" size="digigo" className="w-full sm:w-auto">
              <Plus className="mr-2 h-5 w-5 md:h-6 md:w-6" />
              <span className="hidden sm:inline">Add New Patient</span>
              <span className="sm:hidden">Add Patient</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] overflow-y-auto">
            <PatientForm
              onSubmit={handleSubmit}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-[20px] shadow-sm">
        <div className="p-4 md:p-6 lg:p-[34px]">
          {/* Header with Search and Records Per Page */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <h2 className="text-xl md:text-2xl text-black font-sf-pro font-semibold">
              Patient's list
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2 lg:min-w-[160px]">
                <span className="text-sm text-gray-600 whitespace-nowrap">Display</span>
                <Select value={recordsPerPage} onValueChange={handleRecordsPerPageChange}>
                  <SelectTrigger className="h-10 w-[80px] rounded-xl text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600 whitespace-nowrap">records per page</span>
              </div>

              <div className="relative flex-1 lg:w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search"
                  className="pl-10 h-10 rounded-xl border-gray-200 focus:border-[#7165e1] focus:ring-[#7165e1] text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-4">
            {paginatedPatients.map((patient, index) => (
              <Card key={patient.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-[#7165e1]">
                        {patient.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        ID: {patient.patientId}
                      </p>
                    </div>
                    <Badge variant="completed" className="rounded-[20px] text-xs">
                      Active
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span>{patient.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span>{patient.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span>{patient.age}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleView(patient.id)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(patient.id)}>
                      <PenSquare className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDelete(patient.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader className="bg-[#f4f3ff] rounded-[10px]">
                  <TableRow>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">S.No</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Patient's ID</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Name</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Phone</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Gender</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Age</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Status</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPatients.map((patient, index) => (
                    <TableRow key={patient.id} className="bg-[#f4f3ff] rounded-[10px] my-[10px]">
                      <TableCell className="text-base text-black font-sf-pro">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {patient.patientId}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {patient.name}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {patient.phone}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {patient.gender}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {patient.age}
                      </TableCell>
                      <TableCell>
                        <Badge variant="completed" className="rounded-[40px] text-base font-sf-pro">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleView(patient.id)}>
                            <Eye className="w-5 h-5 text-[#7165e1]" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(patient.id)}>
                            <PenSquare className="w-5 h-5 text-[#7165e1]" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(patient.id)}>
                            <Trash2 className="w-5 h-5 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-6">
            <p className="text-sm text-gray-600">
              Showing page {currentPage} of {totalPages}
              {searchTerm && ` (filtered from ${patients.length} total)`}
            </p>
            
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 px-3 text-xs"
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "digigo" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="h-8 w-8 p-0 text-xs"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 px-3 text-xs"
                >
                  Next
                </Button>
              </div>
            )}
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">
                {searchTerm ? "No patients found matching your search." : "No patients found. Add your first patient to get started."}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}