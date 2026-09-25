// 접종 예정일을 휴대폰/구글 캘린더로 가져갈 수 있도록 iCalendar(.ics) 파일로 만든다.
import { addOffset, formatDate } from './dates.js';

function escapeText(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');
}

// RFC 5545: 한 줄은 75옥텟을 넘지 않도록 접는다. 한글(3바이트)이 잘리지 않게 문자 단위로 나눈다.
export function foldLine(line) {
  const encoder = new TextEncoder();
  const out = [];
  let current = '';
  let bytes = 0;
  for (const ch of line) {
    const size = encoder.encode(ch).length;
    const limit = out.length ? 74 : 75; // 이어지는 줄은 앞의 공백 1바이트 포함
    if (bytes + size > limit) {
      out.push(current);
      current = '';
      bytes = 0;
    }
    current += ch;
    bytes += size;
  }
  out.push(current);
  return out.join('\r\n ');
}

const compact = (iso) => iso.replace(/-/g, '');

export function buildICS(child, plan, { now = new Date() } = {}) {
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//moonsik//baby-vaccination//KO',
    'CALSCALE:GREGORIAN',
    `X-WR-CALNAME:${escapeText(`${child.name} 예방접종`)}`,
  ];
  for (const item of plan) {
    if (item.status === 'done') continue;
    const title = `${child.name} ${item.vaccine.name}(${item.vaccine.disease}) ${item.dose.no}차${item.estimated ? ' (예상)' : ''}`;
    const detail = [
      `권장 시기: ${item.dose.when}`,
      item.lastDay ? `권장 기간: ${formatDate(item.start)} ~ ${formatDate(item.lastDay)}` : `접종 가능일: ${formatDate(item.start)} 이후`,
      item.estimated ? '이전 차수 접종일에 따라 날짜가 달라질 수 있습니다.' : '',
      item.vaccine.note ?? '',
    ]
      .filter(Boolean)
      .join('\n');
    lines.push(
      'BEGIN:VEVENT',
      `UID:${child.id}-${item.id}@moonsik`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${compact(item.start)}`,
      `DTEND;VALUE=DATE:${compact(addOffset(item.start, { days: 1 }))}`,
      `SUMMARY:${escapeText(title)}`,
      `DESCRIPTION:${escapeText(detail)}`,
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapeText(`내일 ${title} 접종일이에요`)}`,
      'TRIGGER:-PT15H', // 전날 오전 9시
      'END:VALARM',
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return lines.map(foldLine).join('\r\n') + '\r\n';
}
