
#include <iostream>
#include <string.h>
#include "header.h"


using namespace std;
// number conversion using stack.

void conversion(int num, int base) {
    if (base < 0) {
        cout << " invalid base " << endl;
    }

    CStack<int> st(1000);

    while (num) {
        st.Push(num % base);
        num /= base;
    }

    int re;
    cout << endl;
    while (!st.IsEmpty()) {
        st.Pop(re);

        cout << re << " ";
    }
    cout << endl;
}

//brackets pair matching
//({[<>]})

bool BracketsMatching(const char *matchStr) {
    CStack<char> Stack(1000);

    int len = strlen(matchStr);
    cout << "str: " << matchStr << " length : " << len << endl;
    char temp;

    for (int i = 0; i < len; ++i) {
        Stack.toString();
        switch (matchStr[i]) {
            case '(':
            case '{':
            case '[':
            case '<':
                Stack.Push(matchStr[i]);

                break;
            case ')':
                if (!Stack.Pop(temp)) {
                    cout << "Not matching empty" << endl;
                    return false;
                }

                if (temp != '(') {
                    cout << "Not Matching" << endl;
                    return false;
                }
                break;

            case '}':
                if (!Stack.Pop(temp)) {
                    cout << "Not matching empty" << endl;
                    return false;
                }
                if (temp != '{') {
                    cout << "Not Matching " << temp << endl;
                    return false;
                }
                break;

            case '>':
                if (!Stack.Pop(temp)) {
                    cout << "Not matching empty" << endl;
                    return false;
                }

                if (temp != '<') {
                    cout << "Not Matching" << endl;
                    return false;
                }
                break;

            case ']':
                if (!Stack.Pop(temp)) {
                    cout << "Not matching empty" << endl;
                    return false;
                }

                if (temp != '[') {
                    cout << "Not Matching" << endl;
                    return false;
                }
                break;
            default:
                cout << "invalid input brackets string " << endl;
                return false;
                break;
        }
    }

    Stack.toString();
    if (Stack.IsEmpty()) {
        cout << "Matching " << endl;
        return true;
    }

    cout << "Not Matching" << endl;
    return false;

}

int main() {

    //conversion(10000, 10);
    //BracketsMatching("{(){<<<>>>}}-");

//    Mazepath ma;
//    ma.Test();
//    const char *input = "-+a*b-cd/ef";
//    const char *s = "ABC  DE  G  F   ";
//    BinTree<char> binT(s);
//    binT.Test();
//    List<int> ls;
//    ls.Test();
    //BinTree<int>::TestBST();
    //CSort<int>::Test();
    //CDulList<int>::Test();
    //CGraph<int>::Test();
    //MFSet<int>::Test();
    //CHeapQueue<int>::Test();
    //CGraph<int>::TestDirected();
    CGraph<int>::TestWeightGraph();
    return 0;
}

