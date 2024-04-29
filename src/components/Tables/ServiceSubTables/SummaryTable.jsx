import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import { useEffect } from "react";

const SummaryTable = ({services, jobs, startDate, endDate}) => {
    function getServiceSummary(serviceId) {
        var specificService = jobs.filter((job) => job.serviceId === serviceId);
        console.log(specificService);
        var totalValue = specificService.length !== 0 ? parseFloat(specificService[0].serviceCost) * specificService.length : 0.00;
        return {
            'count': specificService.length,
            'value': totalValue
        };
    }

    useEffect(() => {
        console.log(services);
        console.log(jobs);
    }, [services, jobs])

    return (
        <Table component={Paper}>
            <TableHead>
                <TableCell>Service</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Number Done</TableCell>
                <TableCell>Total Cost Over Time Range</TableCell>
            </TableHead>
            <TableBody>
                {services.length > 0 && services.map((service) => {
                    var serviceSummary = getServiceSummary(service._id);
                    return (<TableRow>
                        <TableCell>{service.serviceName}</TableCell>
                        <TableCell>{service.cost}</TableCell>
                        <TableCell>{serviceSummary.count}</TableCell>
                        <TableCell>{serviceSummary.value}</TableCell>
                    </TableRow>)
                })}
            </TableBody>
        </Table>
    )
}

export default SummaryTable;