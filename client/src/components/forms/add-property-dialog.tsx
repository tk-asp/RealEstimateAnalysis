import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPropertySchema } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { propertiesApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const formSchema = insertPropertySchema.extend({
  purchaseDate: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface AddPropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPropertyDialog({ open, onOpenChange }: AddPropertyDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      region: "",
      propertyType: "apartment",
      purchasePrice: "0",
      currentValue: "0",
      monthlyRent: "0",
      monthlyExpenses: "0",
      buildingAge: 0,
      area: "0",
      isOccupied: true,
      purchaseDate: new Date().toISOString().split('T')[0],
    },
  });

  const mutation = useMutation({
    mutationFn: propertiesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio/analytics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({
        title: "物件を追加しました",
        description: "新しい物件がポートフォリオに追加されました。",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "エラーが発生しました",
        description: "物件の追加に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    const propertyData = {
      ...data,
      purchaseDate: new Date(data.purchaseDate),
    };
    mutation.mutate(propertyData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>新規物件追加</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">物件名 *</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="例: サンライズマンション101"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">地域 *</Label>
              <Input
                id="region"
                {...form.register("region")}
                placeholder="例: 渋谷区"
              />
              {form.formState.errors.region && (
                <p className="text-sm text-red-500">{form.formState.errors.region.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">住所 *</Label>
            <Input
              id="address"
              {...form.register("address")}
              placeholder="例: 東京都渋谷区神南1-1-1"
            />
            {form.formState.errors.address && (
              <p className="text-sm text-red-500">{form.formState.errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyType">物件種別 *</Label>
              <Select onValueChange={(value) => form.setValue("propertyType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">マンション</SelectItem>
                  <SelectItem value="house">戸建て</SelectItem>
                  <SelectItem value="commercial">商業施設</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buildingAge">築年数（年）*</Label>
              <Input
                id="buildingAge"
                type="number"
                {...form.register("buildingAge", { valueAsNumber: true })}
                placeholder="例: 5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">購入価格（円）*</Label>
              <Input
                id="purchasePrice"
                {...form.register("purchasePrice")}
                placeholder="例: 30000000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentValue">現在価値（円）*</Label>
              <Input
                id="currentValue"
                {...form.register("currentValue")}
                placeholder="例: 32000000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyRent">月額家賃（円）*</Label>
              <Input
                id="monthlyRent"
                {...form.register("monthlyRent")}
                placeholder="例: 120000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyExpenses">月額経費（円）</Label>
              <Input
                id="monthlyExpenses"
                {...form.register("monthlyExpenses")}
                placeholder="例: 15000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">面積（㎡）*</Label>
              <Input
                id="area"
                {...form.register("area")}
                placeholder="例: 45.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchaseDate">購入日 *</Label>
              <Input
                id="purchaseDate"
                type="date"
                {...form.register("purchaseDate")}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isOccupied"
              checked={form.watch("isOccupied")}
              onCheckedChange={(checked) => form.setValue("isOccupied", checked)}
            />
            <Label htmlFor="isOccupied">入居中</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              キャンセル
            </Button>
            <Button 
              type="submit" 
              disabled={mutation.isPending}
              className="bg-real-estate-primary text-white hover:bg-blue-700"
            >
              {mutation.isPending ? "追加中..." : "追加"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
