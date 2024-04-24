import { Paper, Table, TableCell, TableHead } from "@mui/material";

function ServicesScheduledTable (services, selectedService, jobs, startDate, endDate) {
    return (
        <Table component={Paper}>
            <TableHead>
                <TableCell>Date</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Car</TableCell>
                <TableCell>Technician</TableCell>
            </TableHead>
        </Table>
    )
}

export default ServicesScheduledTable;