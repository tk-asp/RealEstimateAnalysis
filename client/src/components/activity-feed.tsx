import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { activitiesApi } from "@/lib/api";
import { 
  DollarSign, 
  UserPlus, 
  Wrench, 
  UserMinus,
  Building,
  TrendingUp
} from "lucide-react";

const getActivityIcon = (type: string) => {
  switch (type) {
    case "income":
      return DollarSign;
    case "expense":
      return TrendingUp;
    case "tenant_change":
      return UserPlus;
    case "maintenance":
      return Wrench;
    default:
      return Building;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case "income":
      return "bg-blue-100 text-real-estate-primary";
    case "expense":
      return "bg-red-100 text-real-estate-danger";
    case "tenant_change":
      return "bg-green-100 text-real-estate-success";
    case "maintenance":
      return "bg-yellow-100 text-real-estate-warning";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  if (days > 0) return `${days}日前`;
  if (hours > 0) return `${hours}時間前`;
  if (minutes > 0) return `${minutes}分前`;
  return "たった今";
};

export default function ActivityFeed() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/activities"],
    queryFn: activitiesApi.getAll,
  });

  if (isLoading) {
    return (
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>最近のアクティビティ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">最近のアクティビティ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">アクティビティはまだありません</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-gray-900">最近のアクティビティ</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {activities.slice(0, 10).map((activity) => {
            const Icon = getActivityIcon(activity.activityType);
            const colorClass = getActivityColor(activity.activityType);
            
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                  {activity.amount && (
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      ¥{parseFloat(activity.amount).toLocaleString()}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {formatTimeAgo(activity.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
