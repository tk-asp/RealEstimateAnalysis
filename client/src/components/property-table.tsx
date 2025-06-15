import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { propertiesApi } from "@/lib/api";
import { AddPropertyDialog } from "./forms/add-property-dialog";
import { useState } from "react";

export default function PropertyTable() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const { data: properties, isLoading } = useQuery({
    queryKey: ["/api/properties"],
    queryFn: propertiesApi.getAll,
  });

  if (isLoading) {
    return (
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>所有物件一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const calculateYield = (rent: string, value: string) => {
    const monthlyRent = parseFloat(rent);
    const propertyValue = parseFloat(value);
    return propertyValue > 0 ? ((monthlyRent * 12) / propertyValue * 100).toFixed(1) : "0.0";
  };

  return (
    <>
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">所有物件一覧</CardTitle>
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="bg-real-estate-primary text-white hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              物件追加
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">物件名</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">地域</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">築年数</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">利回り</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">状況</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">アクション</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {properties?.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                          <Building className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{property.name}</p>
                          <p className="text-sm text-gray-500">{property.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">{property.region}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{property.buildingAge}年</td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {calculateYield(property.monthlyRent, property.currentValue)}%
                    </td>
                    <td className="py-4 px-6">
                      <Badge 
                        variant={property.isOccupied ? "default" : "destructive"}
                        className={property.isOccupied ? 
                          "bg-green-100 text-green-800 hover:bg-green-100" : 
                          "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {property.isOccupied ? "入居中" : "空室"}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <Button variant="ghost" size="sm" className="text-real-estate-primary hover:text-blue-700">
                        詳細
                      </Button>
                    </td>
                  </tr>
                )) || []}
              </tbody>
            </table>
            
            {(!properties || properties.length === 0) && (
              <div className="text-center py-12">
                <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">まだ物件が登録されていません</p>
                <Button 
                  onClick={() => setShowAddDialog(true)}
                  className="mt-4 bg-real-estate-primary text-white hover:bg-blue-700"
                >
                  最初の物件を追加
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AddPropertyDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
      />
    </>
  );
}
