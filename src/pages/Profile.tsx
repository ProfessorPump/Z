import { User, Settings, Heart, Clock, Users, ChefHat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const Profile = () => {
  return (
    <div className="pb-20 pt-4 px-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Profile</h1>
      
      <div className="space-y-6">
        {/* User Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">JD</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold text-foreground">John Doe</h2>
                <p className="text-muted-foreground">Home cook enthusiast</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <Settings size={16} className="mr-2" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Your Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-2">
                  <Heart size={20} className="text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">24</p>
                <p className="text-sm text-muted-foreground">Saved Recipes</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mx-auto mb-2">
                  <ChefHat size={20} className="text-accent" />
                </div>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-sm text-muted-foreground">Recipes Tried</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-foreground">Push Notifications</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground">Recipe Suggestions</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground">Shopping Reminders</span>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Dietary Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Dietary Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {['Vegetarian', 'Gluten-Free', 'Low-Carb'].map((preference) => (
                <span
                  key={preference}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {preference}
                </span>
              ))}
              <Button variant="outline" size="sm">
                + Add More
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            Help & Support
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Privacy Policy
          </Button>
          <Button variant="ghost" className="w-full justify-start text-destructive">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;