#include <bits/stdc++.h>
using namespace std;
class veichile 
{
    public :
      int speed;
      int cost;
      int total()
      {
        return (speed*cost);
      }

};
int main()
{
    veichile car;
    car.speed = 2;
    car.cost = 100;
    cout << car.total() << " "<< "\n";

}