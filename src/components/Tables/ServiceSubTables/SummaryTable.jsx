import { Paper, Table, TableCell, TableHead } from "@mui/material"

const SummaryTable = (services, jobs, startDate, endDate) => {


    return (
        <Table component={Paper}>
            <TableHead>
                <TableCell>Service</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Number Done</TableCell>
                <TableCell>Total Cost Over Time Range</TableCell>
            </TableHead>
        </Table>
    )
}

export default SummaryTable;