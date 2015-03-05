
#ifndef M_HEADER_H
#define M_HEADER_H
#include <iostream>
#include <stdlib.h>
#include <stdio.h>

const int global = 10;
using namespace std;

#define DEBUG 0

class MemAlloc
{
private:

    enum
    {
        ALIGN = 8,
        MAX_BYTES = 128,
        NUMFREELIST = MAX_BYTES / ALIGN
    };

    union obj
    {
        union obj *free_list_link;
        char client_data[1];
    };
    static obj * volatile free_list[NUMFREELIST];

    static int
    ROUND_UP(int bytes)
    {
        return ((bytes + ALIGN - 1) & ~(ALIGN - 1));
    }

    static int
    FREELIST_INDEX(int bytes)
    {
        return ((bytes + ALIGN - 1) / ALIGN - 1);
    }


};

template<typename T>
class CDulList
{

    typedef struct DulNode
    {

        DulNode() : data(0), next(0), prior(0)
        {
        }
        T data;
        struct DulNode *next;
        struct DulNode *prior;
    } DulNode;
private:
    DulNode *head;
    int length;
public:

    CDulList() : head(0)
    {
//        head = new DulNode;
//        head->prior = head->next = head;
    }
    int getlength(){
        return length;
    }

    void
    Insert(T t)
    {   
        DulNode *q = new DulNode;
        q->data = t;
        length++;
        if (!head) {
            head = q;
            head->next=head->prior = head;
            return;
        }      
        
        q->prior = head->prior;
        head->prior->next = q;        
        head->prior = q;
        q->next = head;
        head = q;
        
    }

    void InsertSort() {
        DulNode *p = head;
        do {
            cout <<"start: " << *this <<endl;
            for (DulNode *q = p->next; q!=head; q=q->prior){
                if (q->prior->data > q->data) {
                    T t = q->prior->data;
                    q->prior->data = q->data;
                    q->data = t;
                }
            }
            p = p->next;
            
        }while(p != head);
    }
    friend ostream& operator<<(ostream &os, CDulList &dul)
    {
        DulNode *p = dul.head;
        if (!p) {
            return os;
        }        
        do {
            os << " " << p->data << " ";
            p = p->next;
        } while(p!=dul.head);   
        
        return os;
    }
    
    static void Test()
    {
        int a[] = {49, 38, 65, 97, 76, 13, 27, 49};
        CDulList<int> dul;
        for (int i = 0; i < 8; ++i)
            dul.Insert(a[i]);

        cout << dul << endl;
        
        dul.InsertSort();
        cout << dul << endl;
    } 


};

template <typename Item>
class CStack
{

    enum
    {
        STACK_INIT_SIZE = 100,
        STACKINCREATMENT = 10
    };

private:
    Item *top;
    Item *base;
    int stackSize;
public:

    CStack()
    {
    }

    CStack(int size)
    {
        base = new Item[size];
        if (!base) {
            //alloc falied
        }

        top = base;
        stackSize = size;
    }

    bool
    Push(Item e)
    {
        if (top - base >= stackSize) {
            // full need realloc
        }
        *top++ = e;
        return true;
    }

    bool
    Pop(Item &e)
    {
        if (base == top) {
            return false;
        }

        e = * --top;
        if (DEBUG) {
            cout << "return val : " << e << endl;
        }
        return true;
    }

    bool
    GetTop(Item &e)
    {
        if (base == top)
            return false;
        e = *(top - 1);
        return true;
    }

    bool
    IsEmpty()
    {
        if (base == top) {
            return true;
        }

        return false;
    }

    void
    toString()
    {
        cout << "stack to string : " << endl;
        int size = top - base;
        for (int i = 0; i < size; ++i) {
            cout << base[i] << " " << endl;
        }
        cout << "...end" << endl;
    }

    void
    Test()
    {
        printf("I am a test!!\n");
    }
};

template <typename T>
class CQueue
{

    enum
    {
        INIT_QUEUE_SIZE = 1000,
        INCREAMENT = 10
    };
private:
    int front;
    int rear;
    int size;
    T *elem;

public:

    CQueue(int s = INIT_QUEUE_SIZE) : front(0), rear(0), size(s)
    {
        elem = new T[s];
    }

    int
    QueueLength()
    {
        return (front - rear + size) % size;
    }

    bool
    Enqueue(T t)
    {
        if ((rear + 1) % size == front) {
            return false;
        }
        elem[rear] = t;
        rear = (rear + 1) % size;
        return true;
    }

    bool
    Dequeue(T &t)
    {
        if (front == rear) {
            return false;
        }

        t = elem[front];
        front = (front + 1) % size;
        return true;
    }
};

class Mazepath
{

    enum DIR
    {
        LEFT = 0, RIGHT, UP, DOWN
    };

    typedef struct _Pos
    {
        int row;
        int col;

        _Pos(int r = 0, int c = 0) : row(r), col(c)
        {
        }

        bool operator==(const _Pos &p)
        {
            if (this->row == p.row && this->col == p.col) {
                return true;
            }
            return false;
        }

    } Pos;

    typedef struct _Step
    {

        _Step() : seq(0), direction(DIR::LEFT)
        {
        }

        _Step(int s, Pos p, DIR d) : seq(s), pos(p), direction(d)
        {
        }
        int seq;
        Pos pos;
        DIR direction;

        friend ostream & operator<<(ostream &os, _Step s)
        {
            static const char *dirname[] = {"LEFT", "RIGHT", "UP", "DOWN"};
            os << " seq :" << s.seq << " Pos:" << s.pos.row << "," << s.pos.col << " direction :" << dirname[s.direction];
            return os;
        }
    } Step;

    int maze[10][10] = {
        {-1, -1, -1, -1, -1, -1, -1, -1, -1, -1},
        {-1, 0, 0, -1, 0, 0, 0, -1, 0, -1},
        {-1, 0, 0, -1, 0, 0, 0, -1, 0, -1},
        {-1, 0, 0, 0, 0, -1, -1, 0, 0, -1},
        {-1, 0, -1, -1, -1, 0, 0, 0, 0, -1},
        {-1, 0, 0, 0, -1, 0, 0, 0, 0, -1},
        {-1, 0, -1, 0, 0, 0, -1, 0, 0, -1},
        {-1, 0, -1, -1, -1, 0, -1, -1, 0, -1},
        {-1, -1, 0, 0, 0, 0, 0, 0, 0, -1},
        {-1, -1, -1, -1, -1, -1, -1, -1, -1, -1}
    };
    CStack<Step> stack;
public:

    Mazepath() : stack(100)
    {
    }

public:

    bool
    FindPath(Pos start, Pos end)
    {
        Pos curPos = start;
        int curStep = 1;
        do {
            if (Pass(curPos)) {
                FootPrint(curPos);
                Step s(curStep, curPos, DIR::LEFT);
                //add path
                stack.Push(s);

                if (curPos == end) {
                    return true; // found the path
                }
                curPos = NextPos(curPos, DIR::LEFT);
                curStep++;
            }
            else {
                if (!stack.IsEmpty()) {
                    Step s;
                    stack.Pop(s);
                    while (s.direction == 3 && !stack.IsEmpty()) {
                        MarkPrint(s.pos);
                        stack.Pop(s);
                    }
                    if (s.direction < 3) {
                        int curd = s.direction;
                        curd++;
                        s.direction = (Mazepath::DIR)curd;
                        stack.Push(s);
                        curPos = NextPos(s.pos, s.direction);
                    }
                }
            }

        }
        while (!stack.IsEmpty());

    }

    bool
    Pass(Pos pos)
    {
        if (pos.row >= 10 || pos.col >= 10) {
            return false;
        }

        if (maze[pos.row][pos.col] == 0) {
            return true;
        }
        return false;
    }

    void
    FootPrint(Pos p)
    {
        maze[p.row][p.col] = 1; // have tried this block
    }

    void
    MarkPrint(Pos p)
    {
        maze[p.row][p.col] = 2; // cannot pass
    }

    Pos
    NextPos(Pos p, DIR direct)
    {
        Pos re;
        switch (direct) {
        case LEFT:
            re.row = p.row;
            re.col = p.col - 1;
            break;
        case RIGHT:
            re.row = p.row;
            re.col = p.col + 1;
            break;
        case UP:
            re.row = p.row - 1;
            re.col = p.col;
            break;
        case DOWN:
            re.row = p.row + 1;
            re.col = p.col;
            break;
        }
        return re;
    }

    void
    printMaze()
    {
        for (int i = 0; i < 10; ++i) {
            cout << endl;
            for (int j = 0; j < 10; ++j) {
                cout << maze[i][j] << " ";
            }
        }
    }

    void
    Test()
    {
        Pos start(1, 1), end(8, 8);
        if (FindPath(start, end)) {
            cout << "got path : ";
            stack.toString();
            printMaze();
        }
        else {
            cout << "No path found" << endl;
            printMaze();
        }
    }

};

template <typename T>
class BinTree
{

    enum Balence
    {
        RH = -1,
        EH = 0,
        LH = 1
    };

    typedef struct BiNode
    {
        T data;
        Balence bf;
        BiNode *left, *right;

        BiNode() : data(0), bf((Balence) 0), left(0), right(0)
        {
        }

        friend ostream & operator<<(ostream &os, BiNode &node)
        {
            os << node.data << " ";
            return os;
        }
    } BiNode;
private:
    BiNode *tree;

public:

    BinTree() : tree(0)
    {
    }

    BinTree(const char *input)
    {
        int start = 0;
        CreateTree(&tree, start, input);
    }

    ~BinTree()
    {
    }

    bool
    Visit(BiNode *node)
    {
        if (node) {
            cout << *node;
        }
        return true;
    }

    void
    PreOrderTraverse(BiNode *node)
    {
        if (node) {
            Visit(node);
            PreOrderTraverse(node->left);
            PreOrderTraverse(node->right);
        }
    }

    void
    InOrderTraverse()
    {
        InOrderTraverse(tree);
    }

    void
    InOrderTraverse(BiNode *node)
    {
        CStack<BiNode *> stack(100);
        stack.Push(node);

        BiNode *p;
        while (!stack.IsEmpty()) {
            while (stack.GetTop(p) && p) {
                stack.Push(p->left); // reach the end of the left
            }
            stack.Pop(p); // null pointer 
            if (!stack.IsEmpty()) { // visit node step right
                stack.Pop(p);
                Visit(p);
                //cout << "in Print" << p->data;
                stack.Push(p->right);
            }
        }
    }

    void
    InOrderTrav2()
    {
        InOrderTrav2(tree);
    }

    void
    InOrderTrav2(BiNode *node)
    {
        CStack<BiNode *> stack(100);
        BiNode *p = node;

        while (p || !stack.IsEmpty()) {
            if (p) {
                stack.Push(p);
                p = p->left;
            }
            else {
                BiNode *t;
                stack.Pop(t);
                Visit(t);
                //cout << "print" << p->data << endl;
                p = t->right;
            }
        }
    }

    void
    PostOrderTrav(BiNode *node)
    {
        CStack<BiNode *> stack(100);
        BiNode *p = node;

        while (p || !stack.IsEmpty()) {
            if (p) {
                stack.Push(p);
                p = p->right;
            }
            else {
                stack.Pop(p);
                Visit(p);
                p = p->left;
            }
        }
    }

    void
    CreateTree(BiNode **t, int &index, const char *input)
    {
        if (index >= strlen(input) || input[index] == ' ') {
            *t = 0;
            ++index;
            return;
        }
        else {
            *t = new BiNode;

            (*t)->data = input[index];
            CreateTree(&((*t)->left), ++index, input);
            CreateTree(&((*t)->right), ++index, input);
        }
    }

    int
    GetDepth()
    {
        return GetDepth(tree);
    }

    int
    GetDepth(BiNode *node)
    {
        if (!node) {
            return 0;
        }

        int left = 1, right = 1;

        left += GetDepth(node->left);
        right += GetDepth(node->right);

        return left > right ? left : right;
    }

    void
    Test()
    {
        cout << "Pre Order :" << endl;
        PreOrderTraverse(tree);

        cout << "In Order: " << endl;
        InOrderTraverse(tree);
        cout << "In Order2: " << endl;
        InOrderTrav2(tree);

        cout << "Post Order :" << endl;
        PostOrderTrav(tree);
    }

    bool
    SearchBST(BiNode *st, T t, BiNode *f, BiNode *&p)
    {
        if (!st) {
            p = f;
            return false;
        }
        else if (st->data == t) {
            p = st;
            return true;
        }
        else if (st->data < t) {
            return SearchBST(st->right, t, st, p);
        }
        else {
            return SearchBST(st->left, t, st, p);
        }

    }

    bool
    InsertBST(T t)
    {
        BiNode *p;
        if (!SearchBST(tree, t, NULL, p)) {
            BiNode *s = new BiNode;
            s->data = t;

            if (!p) {
                tree = s;
            }
            else if (p->data < t) {
                p->right = s;
            }
            else {
                p->left = s;
            }
            return true;
        }
        else {
            return false;
        }
    }

    bool
    DeleteBST(T t)
    {
        return DeleteBST(tree, t);
    }

    bool
    DeleteBST(BiNode *&p, T t)
    {

        if (!p) {
            return false;
        }
        else {
            if (t == p->data)
                return Delete(p);
            else if (t < p->data)
                return DeleteBST(p->left, t);
            else
                return DeleteBST(p->right, t);
        }
    }

    bool
    Delete(BiNode *&p)
    {
        if (!p->right) {
            //right child is null, just link it's left child tree
            BiNode *q = p;
            p = p->left;
            delete q;
        }
        else if (!p->left) {
            BiNode *q = p;
            p = p->right;
            delete q;
        }
        else {
            //left and right all not null
            //turn to left, and reach end to replace the delete node
            BiNode *q, *s;
            q = p, s = p->left;
            while (s->right) {
                q = s;
                s = s->right;
            }
            p->data = s->data;
            if (q != p) {
                q->right = s->left;
            }
            else {
                q->left = s->left;
            }

            delete s;
        }
        return true;
    }

    static void
    TestBST()
    {
        int a[] = {45, 24, 53, 45, 12, 24, 90};
        BinTree<int> tree;
        for (int i = 0; i < 100; ++i)
            tree.InsertBST(rand() % 7177);
        cout << "InOrder: ";
        tree.InOrderTrav2();
        cout << "depth: " << tree.GetDepth();
        tree.DeleteBST(45);
        tree.InOrderTrav2();
        cout << "depth: " << tree.GetDepth();
    }

    static void
    RightRotate(BiNode *&root)
    {
        if (!root->left) {
            return;
        }
        BiNode *p = root->left;
        root->left = p->right;
        p->right = root;
        root = p;
    }

    static void
    LeftRotate(BiNode *&root)
    {
        if (!root->right) {
            return;
        }

        BiNode *p = root->right;
        root->right = p->left;
        p->left = root;
        root = p;
    }

    static void
    LeftBalence(BiNode *&root)
    {
        BiNode *lRoot = root->left;
        switch (lRoot->bf) {
        case LH: //new node insert into left tree's left child
            root->bf = lRoot->bf = EH;
            RightRotate(root);
            break;
        case RH: // new node insert into left tree's right child
            BiNode *rRoot = lRoot->right;
            switch (rRoot->bf) {
            case LH:
                root->bf = RH;
                lRoot->bf = EH;
                break;
            case EH:
                root->bf = lRoot->bf = EH;
                break;
            case RH:
                root->bf = EH;
                lRoot->bf = LH;
                break;
            }
            rRoot->bf = EH;
            LeftRotate(root->left);
            RightRotate(root);
            break;
        }
    }

    static void
    RightBalence(BiNode *&node)
    {
    }

    static bool
    InsertAVL(BiNode *&node, T t, bool &taller)
    {
        if (!node) {
            node = new BiNode;
            node->data = t;
            taller = true;
        }
        else {
            if (node->data == t) {
                taller = false;
                return false;
            }
            if (t < node->data) {
                //insert to the left tree
                if (!InsertAVL(node->left, t, taller)) {
                    //fail to insert
                    return false;
                }
                if (taller) {
                    //had insert into the left of node, and need check balence
                    switch (node->bf) {
                    case LH:
                        LeftBalence(node);
                        taller = false;
                        break;
                    case EH:
                        node->bf = LH;
                        taller = true;
                        break;
                    case RH:
                        node->bf = EH;
                        taller = false;
                        break;
                    }
                }
            }//check right tree 
            else {
                if (!InsertAVL(node->right, t, taller)) {
                    //fail to insert
                    return false;
                }
                if (taller) {
                    switch (node->bf) {
                    case LH:
                        node->bf = EH;
                        taller = false;
                        break;
                    case EH:
                        node->bf = RH;
                        taller = true;
                        break;
                    case RH:
                        RightBalence(node);
                        taller = false;
                        break;
                    }
                }
            }
        }
        return true;
    }
};

template <typename T>
class List
{

    enum
    {
        LIST_INIT_SIZE = 5,
        LIST_INCREAMENT = 10
    };
private:
    T *elem;
    int length;
    int listSize;
public:

    List(int size = LIST_INIT_SIZE)
    {
        elem = new T[LIST_INIT_SIZE];
        length = 0;
        listSize = LIST_INIT_SIZE;
    }

    int
    ListLength()
    {
        return length;
    }

    void
    GetElem(int i, T &t)
    {

        if (i < 1 || i > length)
            return;
        t = elem[i - 1];
    }

    bool
    ListInsert_Sq(int i, T t)
    {
        if (i < 1 || i > length + 1) {
            return false;
        }
        if (length >= listSize) {
            //add memory
            T* newbase = new T[listSize + LIST_INCREAMENT];
            memcpy(newbase, elem, sizeof (T) * length);
            delete [] elem;
            elem = newbase;
            listSize = listSize + LIST_INCREAMENT;
        }

        T *q = &(elem[i - 1]);
        for (T *p = &(elem[length - 1]); p >= q; --p) {
            *(p + 1) = *p;
        }

        *q = t;
        length++;
        return true;
    }

    bool
    ListDelete_Sq(int i, T &t)
    {
        if (i < 1 || i > length) {
            return false;
        }
        T *p = &(elem[i - 1]);
        t = *p;
        T *q = elem + length - 1;
        for (++p; p <= q; ++p) {
            *(p - 1) = *p;
        }

        length--;
        return true;
    }

    T &operator[](int i)
    {
        if (i + 1 < 1 || i > length) {
            cout << "Out of range" << endl;
        }

        return elem[i];
    }

    friend ostream & operator<<(ostream &os, List<T> &l)
    {
        os << endl;
        for (int i = 0; i < l.length; ++i) {
            os << l.elem[i] << " ";
        }

        return os;
    }

    int
    GetPowerSet(int i, List<T> A, List<T> &B)
    {
        static int count = 0;
        if (i > A.ListLength()) {
            cout << B << endl;
            count++;
        }
        else {
            T t;
            A.GetElem(i, t);
            int k = B.ListLength();
            B.ListInsert_Sq(k + 1, t);
            GetPowerSet(i + 1, A, B);
            B.ListDelete_Sq(k + 1, t);
            GetPowerSet(i + 1, A, B);
        }
        return count;
    }

    int
    Permutation(char *str, char *pB)
    {
        static int count = 0;
        if (!str || !pB) {
            return count;
        }

        if (*pB == '\0') {
            // a way
            count++;
            cout << str << endl;
        }
        else {
            for (char *pC = pB; *pC != '\0'; pC++) {
                char t = *pC;
                *pC = *pB;
                *pB = t;
                Permutation(str, pB + 1);
                t = *pB;
                *pB = *pC;
                *pC = t;
            }
        }

        return count;
    }

    int
    QueenIssue(int k, int n, List<int> &arr)
    {
        static int count = 0;
        if (k == n) {
            count++;
            cout << arr << endl;
        }
        else {
            for (int i = 0; i < n; ++i) {
                if (IsSafe(k, i, arr)) {
                    arr[k] = i;
                    QueenIssue(k + 1, n, arr);
                }
            }
        }
        return count;
    }

    bool
    IsSafe(int ind, int pos, List<int> &arr)
    {
        for (int i = 0; i < ind; ++i) {
            if (arr[i] == pos || (abs(i - ind) == 1 && abs(arr[i] - pos) == 1)) {
                return false;
            }
        }
        return true;
    }

    void
    Test()
    {
        for (int i = 0; i < 20; ++i) {
            ListInsert_Sq(i + 1, i);
        }

        List<int> B;

        //cout << "number: " << GetPowerSet(1, *this, B);

        //cout << *this <<endl;
        //        char a[] = "abcdefg";
        //        
        //        cout << "number permutation: " << Permutation(a, a);

        for (int i = 0; i < 4; ++i) {
            B.ListInsert_Sq(i + 1, i);
        }
        cout << "number queen solution: " << QueenIssue(0, 4, B);

    }
};

template <typename T>
class CSort
{
private:
    List<T> arr;
public:

    CSort()
    {
    }

    static void
    InsertSort(List<T> &arr)
    {
        int len = arr.ListLength();
        for (int i = 1; i < len; ++i) {
            int j = i-1;
            T t = arr[i];
            while (j>=0 && arr[j] > t ) {
                arr[j+1] = arr[j];
                --j;
            }
            arr[j+1] = t;
        }
//        for (int i = 0; i < len - 1; ++i) {
//            cout << "start :" << arr << endl;
//            for (int j = i + 1; j > 0; --j) {
//                if (arr[j - 1] > arr[j]) {
//                    int t = arr[j - 1];
//                    arr[j - 1] = arr[j];
//                    arr[j] = t;
//                }
//            }
//        }
    }

    static void
    BinSearchInsertSort(List<T> &arr)
    {
        int len = arr.ListLength();
        for (int i = 0; i < len - 1; ++i) {
            cout << "bin insert start :" << arr << endl;
            int low = 0;
            int high = i + 1;
            int j = i + 1;
            while (low <= high) {
                int mid = (low + high) / 2;
                if (arr[mid] < arr[j]) {
                    low = mid + 1;
                }
                else {
                    high = mid - 1;
                }
            }

            if (low != j) {
                T t = arr[j];
                for (int k = j; k > low; --k) {
                    arr[k] = arr[k - 1];
                }
                arr[low] = t;
            }
        }
    }

    static void
    Test()
    {
        int a[] = {49, 38, 65, 97, 76, 13, 27, 49};
        List<int> li, ai;
        for (int i = 0; i < 8; ++i) {
            li.ListInsert_Sq(i + 1, a[i]);
            ai.ListInsert_Sq(i + 1, a[i]);
        }
        CSort::InsertSort(li);
        cout << li << endl;
        CSort::BinSearchInsertSort(ai);
        cout << ai << endl;

    }


};

template<typename T>
class CGraph
{
    enum
    {
        MAXV = 1000
    };

    typedef struct EdgeNode
    {
        T data; //information of this vertices
        int y; //index 
        int weight; // weight value
        struct EdgeNode *next;
        EdgeNode(int ind, T t=0):data(t),y(ind),weight(0),next(0){            
        }
        friend ostream& operator << (ostream &os, EdgeNode &node){
            os << " " << node.y << " ";
            return os;
        }
    } EdgeNode;
private:
    EdgeNode *edges[MAXV];
    int degree[MAXV];
    int nvertices;
    int nedges;
    bool directed;
public:
    bool IsVisited[MAXV];
    
    
    CGraph():nvertices(0), nedges(0), directed(false)
    {
        for (int i = 0; i < MAXV; ++i) {
            degree[i] = 0;
            edges[i] = 0;
        }
    }
    
    
    void InsertEdge(int from, int to) {
        if (from > MAXV || to > MAXV) {
            return;
        }
        
        if (edges[from] == 0) {
            edges[from] = new EdgeNode(from);
            nvertices++;
        }
        EdgeNode *p = edges[from];
        while (p->next != NULL && p->y != to){
            p = p->next;
        }
        if (p->next != NULL) {
            return;
        }
        p->next = new EdgeNode(to);
        
    }
    
    void InsertEdge(int from, int to, bool isDirected) {  
        InsertEdge(from, to);
        if (!isDirected) {
            InsertEdge(to, from);
        }        
    }
    
    bool visit(EdgeNode *p) {
        cout << *p << endl;
        return true;
    }
    void visit(int v) {
        if (edges[v]) {
            cout << *edges[v] << endl;
        }
    }
    int FirstAdjVex(int v) {
        if (edges[v] == NULL) {
            return -1;
        }
        return edges[v]->next->y;
    }
    int NextAdjVex(int v, int w) {
        if (edges[v] == NULL) {
            return -1;
        }
        EdgeNode *p = edges[v];
        while (p) {
            if (p->y == w) {
                if (p->next) {
                    return p->next->y;
                } else {
                    return -1;
                }
            }
            p = p->next;
        }
        
        return -1;
    }
    void DFSTraverse(){
        memset(IsVisited, 0, sizeof(IsVisited));
        
        for (int v = 0; v < nvertices; ++v) {
            if (!IsVisited[v]) {
                DFS(v);
            }
        }
    }
    void DFS(int v) {
        IsVisited[v] = true;
        visit(v);
        for (int w = FirstAdjVex(v); w >= 0; w = NextAdjVex(v, w)) {
            if (!IsVisited[w]){
                DFS(w);
            }
        }
    }
    static  void Test() {
        CGraph<int> graph;
        graph.InsertEdge(0, 1, false);
        graph.InsertEdge(0, 3, false);
        graph.InsertEdge(1, 2, false);
        graph.InsertEdge(3, 2, false);
        graph.InsertEdge(1, 4, false);
        graph.InsertEdge(2, 4, false);
        
        graph.DFSTraverse();



    }
    
    
};

#endif