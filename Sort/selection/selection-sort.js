/**
 * Created by luke on 2015/2/2.
 */

/*
选择排序

选择排序(Selection Sort)的基本思想是：每次从当前待排序的记录中选取关键字最小的记录表，然后与待排序的记录序列中的第一个记录进行交换，直到整个记录序列有序为止。


简单选择排序

简单选择排序(Simple Selection Sort ，又称为直接选择排序)的基本操作是：通过n-i次关键字间的比较，从n-i+1个记录中选取关键字最小的记录，然后和第i个记录进行交换，i=1, 2, … n-1 。
1  排序示例
例：设有关键字序列为：7, 4, -2, 19, 13, 6，直接选择排序的过程：
初始记录的关键字：  7     4    -2     19    13    6
    第一趟排序：  -2     4     7     19    13    6
    第二趟排序：  -2     4     7     19    13    6
    第三趟排序：  -2     4     6     19    13    7
    第四趟排序：  -2     4     6     7     13    19
    第五趟排序：  -2     4     6     7     13    19
    第六趟排序：  -2     4     6     7     13    19

2.算法分析
整个算法是二重循环：外循环控制排序的趟数，对n个记录进行排序的趟数为n-1趟；内循环控制每一趟的排序。
进行第i趟排序时，关键字的比较次数为n-i，则：
比较次数： n*(n - 1) / 2
时间复杂度是：T(n)=O(n2)
空间复杂度是：S(n)=O(1)
从排序的稳定性来看，直接选择排序是不稳定的。

 */


function simpleSelectionSort(sqList) {
    for (var i = 0, len = sqList.length; i < len; ++i) {
        for (var k = i, j = k + 1; j < len; ++j)
            if (sqList[j] < sqList[k]) k = j;

        if (k !== i) {
            var temp = sqList[k];
            sqList[k] = sqList[i];
            sqList[i] = temp;
        }
    }
}
exports.simpleSelectionSort = simpleSelectionSort;

var arr = [7, 4, -2, 19, 13, 6];
simpleSelectionSort(arr);
console.log(arr + '');


/*
树形选择排序

首先对n个记录的关键字两两进行比较，选取n/2个较小者；然后这n/2个较小者两两进行比较，选取n/4个较小者… 如此重复，直到只剩1个关键字为止。
该过程可用一棵有n个叶子结点的完全二叉树表示，每个枝结点的关键字都等于其左、右孩子结点中较小的关键字，根结点的关键字就是最小的关键字。
输出最小关键字后，根据关系的可传递性，欲选取次小关键字，只需将叶子结点中的最小关键字改为“最大值” ，然后重复上述步骤即可。
含有n个叶子结点的完全二叉树的深度为㏒2n+1，则总的时间复杂度为O(n㏒2n) 。

但这种排序方法尚有辅助存储空间较多,和最大值进行多余比较等缺点。为了弥补这些缺陷，出现了另一种选择排序---堆排序
 */



/*
堆排序

1  堆的定义
是n个元素的序列H={k1, k2 , … kn} ，满足：
    ki≤k2i       当2i≤n时
    ki≤k2i+1   当2i+1≤n时

由堆的定义知，堆是一棵以k1为根的完全二叉树。若对该二叉树的结点进行编号(从上到下，从左到右)，得到的序列就是将二叉树的结点以顺序结构存放，堆的结构正好和该序列结构完全一致。

2  堆的性质
    1)  堆是一棵采用顺序存储结构的完全二叉树， k1是根结点；
    2)  堆的根结点是关键字序列中的最小(或最大)值，分别称为小(或大)根堆；
    3)  从根结点到每一叶子结点路径上的元素组成的序列都是按元素值(或关键字值)非递减(或非递增)的；
    4)  堆中的任一子树也是堆。

利用堆顶记录的关键字值最小(或最大)的性质，从当前待排序的记录中依次选取关键字最小(或最大)的记录，就可以实现对数据记录的排序，这种排序方法称为堆排序。

3  堆排序思想

①  对一组待排序的记录，按堆的定义建立堆；
②  将堆顶记录和最后一个记录交换位置，则前n-1个记录是无序的，而最后一个记录是有序的；
③  堆顶记录被交换后，前n-1个记录不再是堆，需将前n-1个待排序记录重新组织成为一个堆，然后将堆顶记录和倒数第二个记录交换位置，即将整个序列中次小关键字值的记录调整(排除)出无序区；
④  重复上述步骤，直到全部记录排好序为止。

结论：排序过程中，若采用小根堆，排序后得到的是非递减序列；若采用大根堆，排序后得到的是非递增序列。

堆排序的关键
①  如何由一个无序序列建成一个堆？
②  如何在输出堆顶元素之后，调整剩余元素，使之成为一个新的堆？

4  堆的调整——筛选
⑴ 堆的调整思想
输出堆顶元素之后，以堆中最后一个元素替代之；然后将根结点值与左、右子树的根结点值进行比较，并与其中小者进行交换；重复上述操作，直到是叶子结点或其关键字值小于等于左、右子树的关键字的值，将得到新的堆。称这个从堆顶至叶子的调整过程为“筛选”。

注意：筛选过程中，根结点的左、右子树都是堆，因此，筛选是从根结点到某个叶子结点的一次调整过程。

5  堆的建立
利用筛选算法，可以将任意无序的记录序列建成一个堆，设R[1],R[2], …,R[n]是待排序的记录序列。
将二叉树的每棵子树都筛选成为堆。只有根结点的树是堆。第⌊n/2⌋个结点之后的所有结点都没有子树，即以第⌊n/2⌋个结点之后的结点为根的子树都是堆。因此，以这些结点为左、右孩子的结点，其左、右子树都是堆，则进行一次筛选就可以成为堆。同理，只要将这些结点的直接父结点进行一次筛选就可以成为堆…。
只需从第⌊n/2⌋个记录到第1个记录依次进行筛选就可以建立堆。

6   堆排序算法实现
堆的根结点是关键字最小的记录，输出根结点后，是以序列的最后一个记录作为根结点，而原来堆的左、右子树都是堆，则进行一次筛选就可以成为堆。

7  算法分析
主要过程：初始建堆和重新调整成堆。设记录数为n，所对应的完全二叉树深度为h 。
◆  初始建堆：每个非叶子结点都要从上到下做“筛选” 。第i层结点数≤2i-1，结点下移的最大深度是h-i，而每下移一层要比较2次，则比较次数C1(n)为：
C1(n)≤4(n-㏒2n-1)
◆  筛选调整：每次筛选要将根结点“下沉”到一个合适位置。第i次筛选时：堆中元素个数为n-i+1；堆的深度是㏒2(n-i+1)+1，则进行n-1次“筛选”的比较次数C2(n)为：
C2(n)<2n㏒2n
堆排序的比较次数的数量级为： T(n)=O(n㏒2n)；而附加空间就是交换时所用的临时空间，故空间复杂度为： S(n)=O(1) 。

堆排序适合记录数较大的情况


http://blog.csdn.net/zz198808/article/details/7678055
 */

/**
 * 已知sqList[s..m]中记录的关键字除sqList[s]之外均满足堆的定义，
 * 本函数调整sqList[s]的关键字，使sqList[s..m]成为一个大堆顶（对其中关键字而言）
 * @param {Array} sqList
 * @param {Number} s
 * @param {Number} m
 */
function heapAdjust(sqList, s, m) {
    var rc = sqList[s];

    // 沿关键字较大的孩子结点向下筛选
    for (var j = 2 * s + 1; j <= m; j = j * 2 + 1) {
        // j为关键字较大的记录下标
        if (j < m && sqList[j] < sqList[j + 1]) ++j;
        // rc应插入在位置s上
        if (rc >= sqList[j]) break;
        sqList[s] = sqList[j];
        s = j;
    }

    sqList[s] = rc;
}

function heapSort(sqList) {
    var len = sqList.length;
    // 建立大堆顶
    for (var i = len >> 1 - 1; i >= 0; --i)
        heapAdjust(sqList, i, len - 1);

    for (i = len - 1; i > 0; --i) {
        // 将堆顶记录和当前未经排序子序列sqList[0..i]中
        // 最后一个记录相互交换
        var temp = sqList[i];
        sqList[i] = sqList[0];
        sqList[0] = temp;

        // 将sqList[0..i - 1]重新调整为大堆顶
        heapAdjust(sqList, 0, i - 1);
    }
}
exports.heapSort = heapSort;

var arr = [1, 3, 4, 5, 7, 2, 6, 8, 0];
heapSort(arr);
console.log(arr + '');
