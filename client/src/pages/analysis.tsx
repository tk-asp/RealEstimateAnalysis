import Header from "@/components/layout/header";
import MarketInsights from "@/components/market-insights";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp, TrendingDown, DollarSign, Home } from "lucide-react";
import { useState } from "react";

export default function Analysis() {
  const [propertyPrice, setPropertyPrice] = useState("");
  const [expectedIncome, setExpectedIncome] = useState("");
  const [vacancyRate, setVacancyRate] = useState("");
  const [expenseRate, setExpenseRate] = useState("");
  const [ownCapital, setOwnCapital] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [interestRate, setInterestRate] = useState("");

  const calculateMetrics = () => {
    const price = parseFloat(propertyPrice) || 0;
    const income = parseFloat(expectedIncome) || 0;
    const vacancy = parseFloat(vacancyRate) || 0;
    const expenseRt = parseFloat(expenseRate) || 0;
    const capital = parseFloat(ownCapital) || 0;
    const loan = parseFloat(loanAmount) || 0;
    const term = parseFloat(loanTerm) || 0;
    const rate = parseFloat(interestRate) || 0;

    // 返済額計算
    const monthlyRate = rate / 100 / 12;
    const monthlyPayments = term * 12;
    const monthlyPayment = monthlyRate > 0 ? 
      (loan * monthlyRate * Math.pow(1 + monthlyRate, monthlyPayments)) /
      (Math.pow(1 + monthlyRate, monthlyPayments) - 1) : loan / monthlyPayments;
    
    const annualPayment = monthlyPayment * 12;
    const totalPayment = monthlyPayment * monthlyPayments;
    
    // 返済比率
    const paymentRatio = income > 0 ? (annualPayment / income) * 100 : 0;
    
    // 控除・諸経費
    const deductionsExpenses = income * ((vacancy + expenseRt) / 100);
    
    // 年間支出
    const annualExpenses = annualPayment + deductionsExpenses;
    
    // 手取り
    const netIncome = income - annualExpenses;
    const monthlyNetIncome = netIncome / 12;
    
    // 利回り計算
    const grossYield = price > 0 ? (income / price) * 100 : 0;
    const netYield = price > 0 ? (netIncome / price) * 100 : 0;
    const investmentYield = capital > 0 ? (netIncome / capital) * 100 : 0;

    return {
      monthlyPayment: monthlyPayment.toFixed(0),
      annualPayment: annualPayment.toFixed(0),
      paymentRatio: paymentRatio.toFixed(1),
      totalPayment: totalPayment.toFixed(0),
      deductionsExpenses: deductionsExpenses.toFixed(0),
      annualExpenses: annualExpenses.toFixed(0),
      netIncome: netIncome.toFixed(0),
      monthlyNetIncome: monthlyNetIncome.toFixed(0),
      grossYield: grossYield.toFixed(2),
      netYield: netYield.toFixed(2),
      investmentYield: investmentYield.toFixed(2),
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="min-h-screen">
      <Header title="投資分析" onMenuClick={() => {}} />
      
      <div className="p-6 space-y-6">
        {/* Investment Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                投資計算機
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyPrice">物件価格（円）</Label>
                  <Input
                    id="propertyPrice"
                    type="number"
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(e.target.value)}
                    placeholder="30000000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedIncome">想定収入（年額・円）</Label>
                  <Input
                    id="expectedIncome"
                    type="number"
                    value={expectedIncome}
                    onChange={(e) => setExpectedIncome(e.target.value)}
                    placeholder="1440000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vacancyRate">空室率（%）</Label>
                  <Input
                    id="vacancyRate"
                    type="number"
                    step="0.1"
                    value={vacancyRate}
                    onChange={(e) => setVacancyRate(e.target.value)}
                    placeholder="5.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expenseRate">諸経費率（%）</Label>
                  <Input
                    id="expenseRate"
                    type="number"
                    step="0.1"
                    value={expenseRate}
                    onChange={(e) => setExpenseRate(e.target.value)}
                    placeholder="15.0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ownCapital">自己資金（円）</Label>
                  <Input
                    id="ownCapital"
                    type="number"
                    value={ownCapital}
                    onChange={(e) => setOwnCapital(e.target.value)}
                    placeholder="6000000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">借入金額（円）</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder="24000000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loanTerm">借入期間（年）</Label>
                  <Input
                    id="loanTerm"
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    placeholder="35"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interestRate">借入金利（%）</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="2.5"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calculation Results */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">シミュレーション結果</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {/* 返済額 */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">月額返済額</p>
                      <p className="text-2xl font-bold text-blue-900">
                        ¥{parseInt(metrics.monthlyPayment).toLocaleString()}
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        年額：¥{parseInt(metrics.annualPayment).toLocaleString()}
                      </p>
                    </div>
                    <Home className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                {/* 返済比率 */}
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-900">返済比率</p>
                      <p className="text-2xl font-bold text-purple-900">{metrics.paymentRatio}%</p>
                      <p className="text-xs text-purple-700 mt-1">返済額/想定収入</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                </div>

                {/* 返済総額 */}
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-900">返済総額</p>
                      <p className="text-2xl font-bold text-red-900">
                        ¥{parseInt(metrics.totalPayment).toLocaleString()}
                      </p>
                      <p className="text-xs text-red-700 mt-1">借入期間全体</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-red-600" />
                  </div>
                </div>

                {/* 控除・諸経費 */}
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-900">控除・諸経費（年額）</p>
                      <p className="text-2xl font-bold text-orange-900">
                        ¥{parseInt(metrics.deductionsExpenses).toLocaleString()}
                      </p>
                      <p className="text-xs text-orange-700 mt-1">想定収入×（空室率＋諸経費率）</p>
                    </div>
                    <Calculator className="w-8 h-8 text-orange-600" />
                  </div>
                </div>

                {/* 年間支出 */}
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-900">年間支出</p>
                      <p className="text-2xl font-bold text-yellow-900">
                        ¥{parseInt(metrics.annualExpenses).toLocaleString()}
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">返済額＋控除・諸経費</p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>

                {/* 手取り */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-900">手取り（月額/年額）</p>
                      <p className="text-2xl font-bold text-green-900">
                        ¥{parseInt(metrics.monthlyNetIncome).toLocaleString()}
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        年額：¥{parseInt(metrics.netIncome).toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                {/* 表面利回り */}
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-900">表面利回り</p>
                      <p className="text-2xl font-bold text-indigo-900">{metrics.grossYield}%</p>
                      <p className="text-xs text-indigo-700 mt-1">想定収入/物件価格</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-indigo-600" />
                  </div>
                </div>

                {/* 実質利回り */}
                <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-teal-900">実質利回り</p>
                      <p className="text-2xl font-bold text-teal-900">{metrics.netYield}%</p>
                      <p className="text-xs text-teal-700 mt-1">年間手取り/物件価格</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-teal-600" />
                  </div>
                </div>

                {/* 投資利回り */}
                <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-pink-900">投資利回り</p>
                      <p className="text-2xl font-bold text-pink-900">{metrics.investmentYield}%</p>
                      <p className="text-xs text-pink-700 mt-1">年間手取り/自己資金</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-pink-600" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Insights */}
        <MarketInsights />

        {/* Risk Analysis */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">リスク分析</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-medium text-red-900 mb-2">空室リスク</h4>
                <p className="text-sm text-red-700">
                  地域の空室率や需要動向を考慮し、空室期間を1-2ヶ月程度見込んでおくことを推奨します。
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-900 mb-2">金利上昇リスク</h4>
                <p className="text-sm text-yellow-700">
                  変動金利の場合、金利上昇により返済額が増加する可能性があります。余裕を持った資金計画が重要です。
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">市場価格変動リスク</h4>
                <p className="text-sm text-blue-700">
                  不動産価格は市場環境により変動します。長期的な保有を前提とした投資戦略を立てましょう。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
