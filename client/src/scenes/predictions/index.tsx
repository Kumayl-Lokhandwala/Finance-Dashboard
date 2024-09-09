import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import { useGetKpisQuery } from "@/state/api";
import { Box, Button, Typography, useTheme } from "@mui/material";
import React, { useMemo, useState } from "react";
import { CartesianGrid, Label, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import regression, {DataPoint} from "regression";

type Props = {};

const Prediction = (props: Props) => {
  const { palette } = useTheme();
  const [isPredictions, setIsPredictions] = useState(false);
  const { data: kpiData } = useGetKpisQuery();

  const formattedData = useMemo(() => {
    if (!kpiData) return [];
    const monthData = kpiData[0].monthlyData;

    const formatted: Array<DataPoint> = monthData.map(
      ({ revenue }, i: number) => {
        return [i, revenue];
      }
    );
    const regressionLine = regression.linear(formatted);

    return monthData.map(({ month, revenue }, i: number) => {
      return {
        name: month,
        "Actual Revenue": revenue,
        "Regression Line": regressionLine.points[i][1],
        "Predicted Revenue": regressionLine.predict(i + 12)[1],
      };
    });
  }, [kpiData]);
  return (
    <DashboardBox
      width="100%"
      height="100%"
      overflow={"hidden"}
      padding={"1rem"}
    >
      <FlexBetween m="1rem 2.5rem" gap={"1rem"}>
        <Box>
          <Typography variant="h3">Revenue and Predictions</Typography>
          <Typography variant="h6">
            Charted Revenue and Predicted Revenue based on Simple Linear
            Regression model
          </Typography>
        </Box>
        <Button
          onClick={() => setIsPredictions(!isPredictions)}
          sx={{
            color: palette.grey[900],
            backgroundColor: palette.grey[700],
            boxShadow: "0.1rem 0.1rem 0.1rem 0.1rem rgba(0,0,0,0.4)",
          }}
        >
          Show Predicted Revenue for Next Year
        </Button>
      </FlexBetween>
      <ResponsiveContainer width="100%">
        <LineChart
          data={formattedData}
          margin={{
            top: 20,
            right: 75,
            left: 20,
            bottom: 80,
          }}
          >
            <CartesianGrid strokeDasharray={"3 3"} stroke={palette.grey[800]}/>
          <XAxis dataKey="name" tickLine={false} style={{fontSize: "10px"}}>
            <Label value="Months" position="insideBottom" offset={-5}/>
            </XAxis>
          <YAxis domain = {[12000,26000]} style={{fontSize: "10px"}} axisLine={{strokeWidth:"0"}} tickFormatter={(v)=>`$${v}`} >
          <Label value="Revenue in USD" position="insideLeft" offset={-5} angle={-90}/>
            </YAxis>
          <Tooltip />
          <Legend verticalAlign="top"/>
          <Line
            type="monotone"
            dataKey="Actual Revenue"
            stroke={palette.primary.main}
            strokeWidth={0}
            dot={{strokeWidth:5}}
            />
            <Line
            type="monotone"
            dataKey="Regression Line"
            stroke="#8884d8"
            dot={false}
            />
            {isPredictions && (
                <Line 
                strokeDasharray={"5 5"}
                type="monotone"
                dataKey={"Predicted Revenue"}
                stroke={palette.secondary[500]}
                />

                
            )}
        </LineChart>
      </ResponsiveContainer>
    </DashboardBox>
  );
};

export default Prediction;
