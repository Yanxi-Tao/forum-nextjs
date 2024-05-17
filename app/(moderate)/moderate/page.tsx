import { fetchReport } from '@/actions/report/fetch-report'

import { DataTable } from './table'
import { columns } from './columns'

export default async function ReportPage() {
  const data = await fetchReport()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
