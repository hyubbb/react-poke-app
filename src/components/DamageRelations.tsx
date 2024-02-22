import React, { useEffect, useState } from "react";
import Type from "./Type";
import { DamageRelations as DamageRelationsProps } from "../types/DamageRelationsOfType";
import {
  Damage,
  DamageFromAndTo,
  SetDamagePokemonForm,
} from "../types/SetDamagePokemonForm";

interface DamageProps {
  damages: DamageRelationsProps[];
}

interface Info {
  name: string;
  url: string;
}

const DamageRelations = ({ damages }: DamageProps) => {
  //   console.log(damages);

  const [damagePokemonForm, setDamagePokemonForm] =
    useState<SetDamagePokemonForm>();

  useEffect(() => {
    const arrayDamage = damages.map((damage) => separateToAndFrom(damage));

    if (arrayDamage.length === 2) {
      // 합치는부분, valueOfKeyName 추가는 별도로
      const obj = joinDamageRelations(arrayDamage);
      /** 
        joinDamageRelations에서 복수의 속성을 하나의 속성으로 만들었으니
        단수 속성처럼 postDamageValue함수로 valueOfKeyName 추가해주고,
    */
      setDamagePokemonForm(reduceDuplicateValues(postDamageValue(obj.from)));
    } else {
      // 속성이 하나일때, valueOfKeyName 속성을 추가해준다.
      setDamagePokemonForm(postDamageValue(arrayDamage[0].from));
    }
  }, []);

  const joinDamageRelations = (props: DamageFromAndTo[]): DamageFromAndTo => {
    return {
      to: joinObject(props, "to"),
      from: joinObject(props, "from"),
    };
  };

  const joinObject = (props: DamageFromAndTo[], string: string) => {
    // 각 속성마다의 데미지를 합쳐준다.

    const key = string as keyof (typeof props)[0];
    const firstArrayValue = props[0][key];
    const secondArrayValue = props[1][key];

    const result = Object.entries(secondArrayValue).reduce(
      (acc, [key, value]: [string, Damage]) => {
        const keyName = key as keyof typeof firstArrayValue;

        const result = firstArrayValue[keyName]?.concat(value);
        return (acc = { [key]: result, ...acc });
      },
      {}
    );

    return result;
  };

  /**
    중복속성 연산해주기
    joinObject 에서 합쳐준 속성값들중에 중복값이 있을때 x2 연산해주는 함수
   */
  const reduceDuplicateValues = (props: SetDamagePokemonForm) => {
    const duplicateValues = {
      double_damage: "4x",
      half_damage: "1/4x",
      no_damage: "0x",
    };

    return Object.entries(props).reduce((acc, [keyName, value]) => {
      const key = keyName as keyof typeof props;

      // double, half, no 각각 하나씩 열거해서 또 다른 함수의 reduce로 하위 배열에 접근 하기 위한함수
      // duplicateValue의 keyname값을 이용해서 중복교체해줄 value(4x,1/4x,0x)값 만 전달해준다.(좋은방법)
      const verifiedValue = filterForUniqueValues(value, duplicateValues[key]);
      // 재조립된 duplicateValue 값이 하나씩 나오면 다시 , key와 value로 재결합
      return (acc = { [key]: verifiedValue, ...acc });
    }, {});
  };

  /**
   *
   * @param {*} valueFiltering
   * @param {*} damageValue
   *
   * 왜 이함수를 만들었나?
   * 각각의 함수의 name의 중복을 비교해서 damageValue값을 바꾸기 위해서
   */
  const filterForUniqueValues = (
    valueFiltering: Damage[],
    damageValue: string
  ) => {
    const initialArray: Damage[] = [];
    // console.log(valueFiltering);
    const result = valueFiltering.reduce((acc, currentValue) => {
      const { url, name } = currentValue;
      // 중복되는 이름을 발견하여 제거 하면 전체 배열길이가 줄어든다.
      const filterACC = acc.filter((a) => a.name !== name);
      // console.log(name, acc);
      // 처음의 배열과 길이가 다르면 중복이 제거됫다는 말이니까 damageValue값을 바꿔준다.
      return filterACC.length === acc.length
        ? (acc = [currentValue, ...acc])
        : (acc = [{ damageValue: damageValue, name, url }, ...filterACC]);
    }, initialArray);
    return result;
  };

  const postDamageValue = (
    props: SetDamagePokemonForm
  ): SetDamagePokemonForm => {
    const result = Object.entries(props).reduce((acc, [key, value]) => {
      const keyName = key as keyof typeof props;

      const valueOfKeyName = {
        double_damage: "2x",
        half_damage: "1/2x",
        no_damage: "0x",
      };

      const result = (acc = {
        [key]: value.map((i: Info[]) => ({
          damageValue: valueOfKeyName[keyName],
          ...i,
        })),
        ...acc,
      });

      return result;
    }, {});
    return result;
  };
  const separateToAndFrom = (damage: DamageRelationsProps): DamageFromAndTo => {
    const from = filterDamageRalations("_from", damage);
    // 예제에선 나에게 상성이 강한 타입만 알아보기때문에 to의 값은 사용안한다.
    const to = filterDamageRalations("_to", damage);
    return { from, to };
  };

  const filterDamageRalations = (
    valueFilter: string,
    damage: DamageRelationsProps
  ) => {
    // 1.객체 값을 배열로 만든뒤에, 2. from과 to로 추리고. 3. 새로운배열생성.
    const result: SetDamagePokemonForm = Object.entries(damage) // 1
      .filter(([key, _]) => {
        return key.includes(valueFilter); // 2
      })
      .reduce((accu, [key, value]) => {
        // 3
        const keyWithValueFilterRemove = key.replace(valueFilter, "");
        return (accu = { [keyWithValueFilterRemove]: value, ...accu });
      }, {});
    return result;
  };

  return (
    <>
      <div className='flex gap-2 flex-col'>
        {damagePokemonForm ? (
          <>
            {Object.entries(damagePokemonForm).map(
              ([key, value]: [string, Damage[]]) => {
                const valueOfKeyName = {
                  double_damage: "Weak",
                  half_damage: "Resistant",
                  no_damage: "immune",
                };
                const keyName = key as keyof typeof damagePokemonForm;
                return (
                  <div
                    key={key}
                    className='capitailize font-medium  text-sm md:text-base text-slate-500 text-center'
                  >
                    <h3 className='pb-2'>{valueOfKeyName[keyName]}</h3>
                    <div className='flex flex-wrap gap-1 justify-center'>
                      {value.length > 0 ? (
                        value.map(({ name, url, damageValue }) => {
                          return (
                            <Type
                              type={name}
                              key={url}
                              damageValue={damageValue}
                            />
                          );
                        })
                      ) : (
                        <Type type={"none"} key={"none"} />
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default DamageRelations;
