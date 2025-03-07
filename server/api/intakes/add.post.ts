import { ConnectDB } from "~/utils/db";
import IntakeModel from "~~/server/models/intake.model";

export default defineEventHandler(async (event) => {
  // Get data from body
  const data = await readBody(event);

  function hasNumbers(t) {
    var regex = /\d/g;
    return regex.test(t);
  }
  let income = 0;
  let size = 1;
  if (hasNumbers(data.Income)) {
    income = parseFloat(data.Income.replace(/[^0-9.]/g, ""));
  } else {
    income = 0;
  }
  if (hasNumbers(data.FamilySize)) {
    size = parseInt(data.FamilySize.replace(/[^0-9]/g, ""));
  } else {
    size = 1;
  }
  let freq =
    income >= 15000
      ? 1
      : data.IncomeFrequency == "No Income"
      ? 1
      : data.IncomeFrequency == "Weekly"
      ? 52
      : data.IncomeFrequency == "Bi-Weekly"
      ? 26
      : data.IncomeFrequency == "2 Times per Month"
      ? 24
      : data.IncomeFrequency == "Monthly"
      ? 12
      : data.IncomeFrequency == "Annually"
      ? 1
      : 1;
  const fpl = (income * freq) / (size * 6430 + 11780);
  const quint =
    fpl <= 0.5
      ? 1
      : fpl > 0.5 && fpl <= 1
      ? 2
      : fpl > 1 && fpl <= 1.5
      ? 3
      : fpl > 1.5 && fpl <= 2
      ? 4
      : fpl > 2
      ? 5
      : 0;

  data["CalcIncome"] = income;
  data["CalcIncomeFrequency"] = freq;
  data["CalcIncomeFrequencyOverride"] = income >= 15000 ? "Yes" : "No";
  data["CalcFamilySize"] = size;
  data["CalcFPL"] = fpl;
  data["CalcQuintile"] = quint;

  // Update a result
  await ConnectDB();
  try {
    const res = await IntakeModel.create({ ...data });
    return { message: "New Intake Form Successfully Added" };
  } catch (e: any) {
    throw createError({
      message: e.message,
    });
  }
});
