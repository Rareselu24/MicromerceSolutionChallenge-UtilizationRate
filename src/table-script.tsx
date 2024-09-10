import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useMemo } from "react";
import sourceData from "./source-data.json";
import type { SourceDataType, TableDataType } from "./types";
import { Rowing } from "@mui/icons-material";

/**
 * Example of how a tableData object should be structured.
 *
 * Each `row` object has the following properties:
 * @prop {string} person - The full name of the employee.
 * @prop {number} past12Months - The value for the past 12 months.
 * @prop {number} y2d - The year-to-date value.
 * @prop {number} may - The value for May.
 * @prop {number} june - The value for June.
 * @prop {number} july - The value for July.
 * @prop {number} august
 * @prop {number} netEarningsPrevMonth - The net earnings for the previous month.
 */

let euro = Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
});

const tableData: TableDataType[] = (sourceData as unknown as SourceDataType[])
  .filter((dataRow) => dataRow.teams === undefined)
  .map((dataRow) => {
  const person = `${dataRow?.employees?.name ?? dataRow?.externals?.name}`;
  const past12Months = parseFloat(dataRow?.employees?.workforceUtilisation?.utilisationRateLastTwelveMonths || dataRow?.externals?.workforceUtilisation?.utilisationRateLastTwelveMonths || "x");
  const y2d = parseFloat(dataRow?.employees?.workforceUtilisation?.utilisationRateYearToDate || dataRow?.externals?.workforceUtilisation?.utilisationRateYearToDate || "x");
  const june = parseFloat(dataRow?.employees?.workforceUtilisation?.lastThreeMonthsIndividually?.[2].utilisationRate || dataRow?.externals?.workforceUtilisation?.lastThreeMonthsIndividually?.[2].utilisationRate || "x");
  const july = parseFloat(dataRow?.employees?.workforceUtilisation?.lastThreeMonthsIndividually?.[1].utilisationRate || dataRow?.externals?.workforceUtilisation?.lastThreeMonthsIndividually?.[1].utilisationRate || "x");
  const august = parseFloat(dataRow?.employees?.workforceUtilisation?.lastThreeMonthsIndividually?.[0].utilisationRate || dataRow?.externals?.workforceUtilisation?.lastThreeMonthsIndividually?.[0].utilisationRate || "x");

  const calculateLastMonthIncome = ()  => {
    // Get hourly rate and utilisation data
    const hourlyRate = parseFloat(dataRow.employees?.hourlyRateForProjects || dataRow.externals?.hourlyRateForProjects || "x");

    const HoursPerMonth = 160;
    
    // Calculate worked hours based on utilisation rate
    const workedHours = HoursPerMonth * august;
  
    // Calculate last month's income
    var lastMonthIncome = (workedHours * hourlyRate);
    if(Number.isNaN(lastMonthIncome))
      lastMonthIncome = 0 ;
    return lastMonthIncome;
  };

  const row: TableDataType = {
    person: `${person} ` ,
    past12Months: `${past12Months * 100} %`,
    y2d: `${y2d * 100} %`,
    june: `${june * 100} %`,
    july: `${july * 100} %`,
    august: `${august * 100} %`,
    netEarningsPrevMonth: `${euro.format(calculateLastMonthIncome(person))}`,
  };
  return row;
});

const Example = () => {
  const columns = useMemo<MRT_ColumnDef<TableDataType>[]>(
    () => [
      {
        accessorKey: "person",
        header: "Person",
      },
      {
        accessorKey: "past12Months",
        header: "Past 12 Months",
      },
      {
        accessorKey: "y2d",
        header: "Y2D",
      },
      {
        accessorKey: "june",
        header: "June",
      },
      {
        accessorKey: "july",
        header: "July",
      },
      {
        accessorKey: "august",
        header: "August",
      },
      {
        accessorKey: "netEarningsPrevMonth",
        header: "Net Earnings Prev Month",
      },

    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
  });

  return <MaterialReactTable table={table} />;
};

export default Example;
