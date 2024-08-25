#[derive(Debug, Clone, Copy)]
pub struct IndexGen {
    len: usize,
    base: usize,
    head: usize,
    head_lim: usize,
    head_log: usize,
    base_log: u8,
    done: usize,
    end: bool,
}

impl IndexGen {
    const fn trailing_zeroes_and_len(mut value: usize) -> (usize, usize) {
        if value == 0 {
            return (0, 0);
        }

        let mut count_trailing_zeroes = 0;
        let mut count_digits = 0;

        while (value & 1) == 0 {
            count_trailing_zeroes += 1;
            value >>= 1;
        }
        while value != 0 {
            count_digits += 1;
            value >>= 1;
        }

        (count_trailing_zeroes, count_trailing_zeroes + count_digits)
    }

    pub const fn new(len: usize) -> Self {
        let (trailing, digit_len) = Self::trailing_zeroes_and_len(len);
        let head_log = trailing;
        let head_lim = 1
            << (digit_len
                - trailing
                - if len.is_power_of_two() { 1 } else { 0 });

        Self {
            len,
            head: 0,
            head_log,
            head_lim,
            base: 0,
            done: 0,
            base_log: (trailing - 1) as u8,
            end: false,
        }
    }

    #[inline]
    fn add_head(&mut self) {
        self.head += 1;
        self.head %= self.head_lim;
    }

    #[inline]
    fn add_base(&mut self) {
        let mut start = 1 << self.base_log;

        while start > 0 && (start & self.base) > 1 {
            self.base ^= start;
            start >>= 1;
        }

        self.base |= start;
    }

    #[inline(always)]
    fn join(&mut self) -> usize {
        (self.head << self.head_log) | self.base
    }
}

impl Iterator for IndexGen {
    type Item = usize;

    fn next(&mut self) -> Option<Self::Item> {
        (self.done < self.len).then(|| {
            let mut value = self.join();
            loop {
                self.end = value == self.len - 1;
                self.add_head();

                (self.head == 0).then(|| self.add_base());

                if value < self.len || self.done >= self.len {
                    break;
                }
                value = self.join();
            }
            self.done += 1;

            value
        })
    }

    #[inline]
    fn size_hint(&self) -> (usize, Option<usize>) {
        (self.len, Some(self.len))
    }
}
