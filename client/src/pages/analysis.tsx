import Header from "@/components/layout/header";
import MarketInsights from "@/components/market-insights";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp, DollarSign, Home } from "lucide-react";
import { useState } from "react";

export default function Analysis() {
  const [purchasePrice, setPurchasePrice] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");

  const calculateMetrics = () => {
    const price = parseFloat(purchasePrice) || 0;
    const rent = parseFloat(monthlyRent) || 0;
    const expenses = parseFloat(monthlyExpenses) || 0;
    const down = parseFloat(downPayment) || 0;
    const rate = parseFloat(interestRate) || 0;
    const term = parseFloat(loanTerm) || 0;

    const netMonthlyIncome = rent - expenses;
    const grossYield = price > 0 ? (rent * 12) / price * 100 : 0;
    const netYield = price > 0 ? (netMonthlyIncome * 12) / price * 100 : 0;

    // Loan calculation
    const loanAmount = price - down;
    const monthlyRate = rate / 100 / 12;
    const monthlyPayments = term * 12;
    const monthlyPayment = monthlyRate > 0 ? 
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, monthlyPayments)) /
      (Math.pow(1 + monthlyRate, monthlyPayments) - 1) : loanAmount / monthlyPayments;

    const cashFlow = netMonthlyIncome - monthlyPayment;
    const cashOnCashReturn = down > 0 ? (cashFlow * 12) / down * 100 : 0;

    return {
      grossYield: grossYield.toFixed(2),
      netYield: netYield.toFixed(2),
      monthlyPayment: monthlyPayment.toFixed(0),
      cashFlow: cashFlow.toFixed(0),
      cashOnCashReturn: cashOnCashReturn.toFixed(2),
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
                  <Label htmlFor="purchasePrice">物件価格（円）</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    placeholder="30000000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyRent">月額家賃（円）</Label>
                  <Input
                    id="monthlyRent"
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(e.target.value)}
                    placeholder="120000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyExpenses">月額経費（円）</Label>
                  <Input
                    id="monthlyExpenses"
                    type="number"
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(e.target.value)}
                    placeholder="15000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="downPayment">頭金（円）</Label>
                  <Input
                    id="downPayment"
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    placeholder="6000000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="interestRate">金利（%）</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="2.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanTerm">返済期間（年）</Label>
                  <Input
                    id="loanTerm"
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    placeholder="35"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calculation Results */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">計算結果</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">表面利回り</p>
                      <p className="text-2xl font-bold text-blue-900">{metrics.grossYield}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-900">実質利回り</p>
                      <p className="text-2xl font-bold text-green-900">{metrics.netYield}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-900">月額返済額</p>
                      <p className="text-2xl font-bold text-purple-900">
                        ¥{parseInt(metrics.monthlyPayment).toLocaleString()}
                      </p>
                    </div>
                    <Home className="w-8 h-8 text-purple-600" />
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-900">月額キャッシュフロー</p>
                      <p className="text-2xl font-bold text-yellow-900">
                        ¥{parseInt(metrics.cashFlow).toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-900">自己資金利回り</p>
                      <p className="text-2xl font-bold text-orange-900">{metrics.cashOnCashReturn}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-600" />
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
