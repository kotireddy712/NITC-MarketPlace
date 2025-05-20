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
    car.speed = 200;
    car.cost = 200;
    hi this is sekhar
    cout << car.total() << " "<< "\n";

}