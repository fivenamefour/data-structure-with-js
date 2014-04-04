function List() {
  this.head = null;
  this.tail = null;
}

List.makeNode = function (data) {
  return {
    data: data || null,
    next: null
  };
};

List.mergeList = function (a, b, compare) {
  var ha = a.head;
  var hb = b.head;
  var pa = ha;
  var pb = hb;
  var c = new List();
  var q;
  compare = compare || function (data1, data2) {
    return data1 <= data2;
  };

  while (pa && pb) {
    var data1 = pa.data;
    var data2 = pb.data;

    if (!compare(data1, data2)) {
      // delete head node
      q = a.delFirst();
      // append the node to c linkedList
      c.append(q);
      pa = a.head;
    } else {
      q = b.delFirst();
      c.append(q);
      pb = b.head;
    }
  }

  if (pa) {
    c.append(pa);
  } else {
    c.append(pb);
  }

  return c;
};

List.prototype = {
  delFirst: function () {
    var head = this.head;
    this.head = this.head.next;
    head.next = null;
    return head;
  },
  append: function (node) {
    if (this.head !== null) {
      this.tail.next = node;
      this.tail = this.tail.next;
    } else {
      this.head = node;
      this.tail = node;
    }
  },
  add: function (data) {
    if (this.head === null) {
      this.head = List.makeNode();
      this.tail = this.head;
    } else {
      this.tail.next = List.makeNode();
      this.tail = this.tail.next;
    }

    this.tail.data = data;
  },
  'delete': function (data) {
    var current = this.head;
    var previous = this.head;

    while (current !== null) {
      if (data === current.data) {
        if (current === this.head) {
          this.head = current.next;
          return true;
        }

        if (current === this.tail) this.tail = previous;

        previous.next = current.next;
        return true;
      }

      previous = current;
      current = current.next;
    }

    return false;
  },
  insertAsFirst: function (data) {
    var temp = List.makeNode();
    temp.next = this.head;
    this.head = temp;
    temp.data = data;
  },
  insertAfter: function (target, data) {
    var current = this.head;
    while (current !== null) {
      if (current.data === target) {
        var temp = List.makeNode();
        temp.data = data;
        temp.next = current.next;

        if (current === this.tail) this.tail = temp;

        current.next = temp;
        return;
      }

      current = current.next;
    }
  },
  item: function (index) {
    var current = this.head;

    while (current !== null) {
      if (--index === 0) return current;

      current = current.next;
    }

    return null;
  },
  each: function (callback) {
    var current = this.head;

    while (current !== null) {
      callback(current);
      current = current.next;
    }
  }
};

function Term() {
  // 系数
  this.coef = null;
  // 指数
  this.expn = null;
}

// 一元多项式
function Polynomial() {
  List.call(this);
}
Polynomial.prototype = {
  __proto__: List.prototype,

  locateElem: function (elem, compare) {
    var current = this.head;
    var prev = current;

    while (current !== null) {
      var obj = {};
      var ret = compare(current.data, elem);
      if (ret === 0) {
        obj.data = current;
        obj.found = true;
        break;
      } else if (ret > 0) {
        obj.data = prev;
        obj.found = false;
        break;
      }

      prev = current;
      current = current.next;
    }

    return obj;
  },
  initList: function () {
    this.head = List.makeNode();
    this.head.data = new Term();
    this.tail = this.head;
  },
  cmp: function (a, b) {
    if (a.expn < b.expn) {
      return -1;
    } else if (a.expn === b.expn) {
      return 0;
    } else {
      return 1;
    }
  },
  // 输入m项的系数和指数，建立表示一元多项式的有序链表p
  createPolyn: function (elems, elems2) {
    var m = elems.length;
    this.initList();
    var h = this.head;
    var e = h.data;
    e.coef = 0;
    e.expn = -1;

    for (var i = 0; i < m; i++) {
      e.coef = +elems[i];
      e.expn = +elems2[i];

      var q = this.locateElem(e, this.cmp);
      if (!q.found) {
        this.insertAsFirst(e);
      }

      e = {};
    }
  },
  // 多项式加法，a = a + b
  addPolyn: function (b) {
    var a = this;
    // ha, hb分别指向头结点
    var ha = a.head;
    var hb = b.head;
    // qa，qb分别指向当前结点
    var qa = ha;
    var qb = hb;

    while (qa && qb) {
      // 当前的比较元素
      var elem1 = qa.data;
      var elem2 = qb.data;

      switch (this.cmp(elem1, elem2)) {
        // 多项式a中当前结点的指数值小
        case -1:
          ha = qa;
          qa = qa.next;
          break;
        // 两者的指数相等
        case 0:
          var sum = elem1.coef + elem2.coef;
          // 修改多项式a中当前结点的系数值
          if (sum !== 0) {
            qa.data.coef = sum;
            ha = qa;

            // 删除多项式a中当前结点
          } else {
            a.delete(elem1);
          }

          b.delFirst();
          hb = b.head;
          qb = hb;
          qa = ha.next;
          break;
        // TODO
        case 1:
          a.insertAsFirst(b.delFirst().data);
          qb = hb;
          ha = a.head;
          break;
      }
    }

    if (b.head) {
      a.append(qb);
    }
  }
};

describe('polyn tests', function(){
  var test = new Polynomial();
  test.createPolyn([-1, 2, 4], [1, 2, 3]);
  var test2 = new Polynomial();
  test2.createPolyn([1, 2, 3], [1, 2, 3]);

  it('should add a new polyn', function(){
    test.addPolyn(test2);
    expect(test.head.data).toEqual({coef: 7,expn: 3});
    expect(test.head.next.data).toEqual({coef: 4,expn: 2});
    expect(test.head.next.next).toEqual(null);
  });

  var test3 = new Polynomial();
  test3.createPolyn([1, 5, 2], [1, 5, 2]);
  it('should add another new polyn', function(){
    test.addPolyn(test2);
    expect(test.head.data).toEqual({coef: 1,expn: 1});
    expect(test.head.next.data).toEqual({coef: 5,expn: 5});
    expect(test.head.next.next.data).toEqual({coef: 6,expn: 2});
    expect(test.head.next.next.next.data).toEqual({coef: 7,expn: 3});
  });
});