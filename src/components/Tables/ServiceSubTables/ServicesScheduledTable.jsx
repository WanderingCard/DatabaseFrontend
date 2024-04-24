import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

function ServicesScheduledTable ({services, selectedService, jobs, startDate, endDate}) {
    /**
     * 
     * @param {Array[Object]} array - an array of objects, must contain the date property 
     */
    function sortByDate(array) {
        var sortedArray = array.sort((a,b) => new Date(a.date) - new Date(b.date))
        return sortedArray;
    }
    
    return (
        <Table component={Paper}>
            <TableHead>
                <TableCell>Date and Time</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Car</TableCell>
                <TableCell>Technician</TableCell>
            </TableHead>
            <TableBody>
                {sortByDate(jobs).map((job) => (
                    <TableRow>
                        <TableCell>{job.date}</TableCell>   
                        <TableCell>{job.customerName}</TableCell>
                        <TableCell>{job.carInfo}</TableCell>
                        <TableCell>{job.techName}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default ServicesScheduledTable;