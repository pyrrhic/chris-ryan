import {useEffect, useState} from "react";

function formatNumber(value: number | null): string {
    return Number(value).toLocaleString("en-US");
}

// Utility function to parse formatted input back to a number
function parseFormattedNumber(value: string): number {
    const parsed = value.replace(/,/g, ""); // Remove commas
    return isNaN(Number(parsed)) ? 0 : Number(parsed);
}

interface CalculatedData {
    balance: number;
    addedCash: number;
    returns: number;
    year: number;
};

function calculateReturns(startingBalance: number, cashToAddPerYear: number, annualReturn: number, startingYear: number, goalBalance: number) {
    const data: CalculatedData[] = [];

    let currentBalance = startingBalance;
    let iterations = 0;
    while (currentBalance < goalBalance) {
        const annualReturnPercentage = annualReturn / 100;
        const returns = (currentBalance + cashToAddPerYear) * annualReturnPercentage;
        // debugger;

        if (returns <= 0) {
            break;
        }

        currentBalance += returns;
        currentBalance += cashToAddPerYear;
        iterations++;

        data.push({
            balance: currentBalance,
            addedCash: cashToAddPerYear,
            returns: returns,
            year: startingYear + iterations,
        });
    }

    return data;
}

export default function RetirementPage() {
    const headerStyles = "border border-slate-600";

    const [goalBalance, setGoalBalance] = useState<number>(() => {
        const saved = localStorage.getItem("goalBalance");
        return saved ? Number(saved) : 0;
    });
    const [startingBalance, setStartingBalance] = useState<number>(() => {
        const saved = localStorage.getItem("startingBalance");
        return saved ? Number(saved) : 0;
    });
    const [cashToAddPerYear, setCashToAddPerYear] = useState<number>(() => {
        const saved = localStorage.getItem("cashToAddPerYear");
        return saved ? Number(saved) : 0;
    });
    const [annualReturn, setAnnualReturn] = useState<number>(() => {
        const saved = localStorage.getItem("annualReturn");
        return saved ? Number(saved) : 0;
    });
    const [startingYear, setStartingYear] = useState<number>(() => {
        const saved = localStorage.getItem("startingYear");
        return saved ? Number(saved) : 0;
    });

    const [calculatedData, setCalculatedData] = useState<CalculatedData[]>();

    useEffect(() => {
        localStorage.setItem("goalBalance", goalBalance.toString());
        localStorage.setItem("startingBalance", startingBalance.toString());
        localStorage.setItem("cashToAddPerYear", cashToAddPerYear.toString());
        localStorage.setItem("annualReturn", annualReturn.toString());
        localStorage.setItem("startingYear", startingYear.toString());

        const returnsData = calculateReturns(startingBalance, cashToAddPerYear, annualReturn, startingYear, goalBalance);
        if (returnsData.length > 1) setCalculatedData(returnsData);

    }, [startingBalance, cashToAddPerYear, annualReturn, startingYear, goalBalance]);

    return (
        <div className="mx-4 md:mx-32">
            <div className="">
                <label className="flex flex-col p-2">
                    Goal Balance in $
                    <input
                        className="border p-2"
                        type="text"
                        placeholder="ex. 1,000"
                        value={formatNumber(goalBalance)} // Display formatted value
                        onChange={(e) => setGoalBalance(parseFormattedNumber(e.target.value))} // Set parsed number
                    />
                </label>
                <label className="flex flex-col p-2">
                    Starting Balance in $
                    <input
                        className="border p-2"
                        type="text"
                        placeholder="ex. 1,000"
                        value={formatNumber(startingBalance)}
                        onChange={(e) => setStartingBalance(parseFormattedNumber(e.target.value))}
                    />
                </label>
                <label className="flex flex-col p-2">
                    Amount of Cash to add per year in $
                    <input
                        className="border p-2"
                        type="text"
                        placeholder="ex. 199"
                        value={formatNumber(cashToAddPerYear)}
                        onChange={(e) => setCashToAddPerYear(parseFormattedNumber(e.target.value))}
                    />
                </label>
                <label className="flex flex-col p-2">
                    Annual Return in %
                    <input
                        className="border p-2"
                        type="text"
                        placeholder="ex. 7"
                        value={annualReturn.toString()} // Percentage doesn't need formatting
                        onChange={(e) => setAnnualReturn(parseFormattedNumber(e.target.value))}
                    />
                </label>
                <label className="flex flex-col p-2">
                    Starting Year
                    <input
                        className="border p-2"
                        type="text"
                        placeholder="ex. 2019"
                        value={startingYear.toString()}
                        onChange={(e) => setStartingYear(parseFormattedNumber(e.target.value))}
                    />
                </label>
            </div>

            {calculatedData &&
                <table className="table-auto w-full border-collapse">
                    <thead>
                    <tr>
                        <th className={headerStyles}>Starting Balance</th>
                        <th className={headerStyles}>Returns</th>
                        <th className={headerStyles}>Ending Balance</th>
                        <th className={headerStyles}>Year</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        calculatedData.sort((a, b) => b.year - a.year).map((row, index) => (
                            <tr className="" key={index}>
                                <td className="border border-slate-600 p-2">{'$' + formatNumber(row.balance - row.returns - row.addedCash)}</td>
                                <td className="border border-slate-600 p-2">{'$' + formatNumber(row.returns)}</td>
                                <td className="border border-slate-600 p-2">{'$' + formatNumber(row.balance)}</td>
                                <td className="border border-slate-600 p-2">{row.year}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            }
        </div>
    );
}